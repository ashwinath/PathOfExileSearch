import axios from "axios";
import elasticSearchStore from "../es";
import logger from "../logger";
import { EsPoeItem } from "../interfaces";

export interface Etl {
  process(): void; 
}

interface PoeWikiParams {
  action: string;
  format: string;
  tables: string;
  fields: string;
  where?: string;
  group_by: string;
  order_by: string;
  limit: number;
  offset: number;
}

interface PoeWikiResponse {
  cargoquery: PoeItemsTitle[];
}

interface PoeItemsTitle {
  title: object; // a little clunky here since the api returns funny results
}

class MainIndexer implements Etl {
  private WIKI_BASE_URL = "https://pathofexile.gamepedia.com/api.php";
  private PROJECTIONS = [
    "name",
    "class",
    "base_item",
    "drop_level",
    "drop_level_maximum",
    "required_dexterity",
    "required_intelligence",
    "required_level",
    "required_level_base",
    "required_strength",
    "base_item",
    "mods",
  ];

  constructor() {
    this.poeItemMapper = this.poeItemMapper.bind(this);
    this.mapAndDownloadExtraStats = this.mapAndDownloadExtraStats.bind(this);
  }

  public async process() {
    await elasticSearchStore.sendItemMapping();

    let limit = 100;
    let offset = 0;
    for (;;) {
      logger.info(`Downloading from offset=${offset}, limit=${limit}`)
      const response = await axios.get<PoeWikiResponse>(this.WIKI_BASE_URL, {
        params: this.constructParams(limit, offset),
      });

      if (response.status !== 200) {
        break;
      }

      const { cargoquery } = response.data;
      if (cargoquery.length === 0) {
        break;
      }

      logger.info(`Persisting into ElasticSearch from offset=${offset}, limit=${limit}`);
      await Promise.all(cargoquery.map(this.mapAndDownloadExtraStats));

      offset += limit;
      logger.info(`Done, offset=${offset}, limit=${limit}`);
    }
    logger.info(`Finished indexing all items in POE.`);
  }

  private async mapAndDownloadExtraStats(poeItem: PoeItemsTitle) {
    const marshalledItem = await this.poeItemMapper(poeItem);
    await elasticSearchStore.store("items", marshalledItem, marshalledItem.name);
  }

  private async poeItemMapper(poeItem: PoeItemsTitle): Promise<EsPoeItem> {
    const mods = poeItem.title["mods"].split(",").map((x) => x.trim())
    const modTexts: string[] = []
    for (let i = 0; i < mods.length; ++i) {
      const mod = mods[i]
      if (!mod) {
        continue;
      }
      try {
        const modResponse = await axios.get<PoeWikiResponse>(this.WIKI_BASE_URL, {
          params: {
            action: "cargoquery",
            tables: "mods",
            format: "json",
            fields: "stat_text",
            where: `id="${mod}"`,
          }
        });
        let modText = modResponse.data.cargoquery[0]["title"]["stat text"];

        // Find all [[]] stuff like [[Chaos Damage]] or separated by pipes [[Item Socket|Sockets]]
        // Take the right side of the pipe
        const matches = modText.match(/\[\[[^\]]*\]\]/g) || [];
        matches.forEach((match) => {
          let split = match.replace("[[", "").replace("]]", "").split("|");
          let sanitisedOutput = split[split.length - 1]; // take the last element.
          modText = modText.replace(match, sanitisedOutput);
        });

        modTexts.push(modText)
      } catch (error) {
        console.log(error)
      }
    }
    return {
      name: poeItem.title["name"],
      className: poeItem.title["class"],
      baseItem: poeItem.title["base item"],
      dropLevel: parseInt(poeItem.title["drop level"], 10),
      dropLevelMaximum: parseInt(poeItem.title["drop level maximum"], 10),
      requiredDexterity: parseInt(poeItem.title["required dexterity"], 10),
      requiredIntelligence: parseInt(poeItem.title["required intelligence"], 10),
      requiredLevel: parseInt(poeItem.title["required level"], 10),
      requiredLevelBase: parseInt(poeItem.title["required level base"], 10),
      requiredStrength: parseInt(poeItem.title["required strength"], 10),
      mods: modTexts,
      id: poeItem.title["id"],
    };
  }

  private constructParams(limit: number, offset: number): PoeWikiParams {
    return {
      'action': 'cargoquery',
      "format": "json",
      'tables': 'items',
      'fields': this.PROJECTIONS.join(","),
      'where': 'class<>"Microtransactions"',
      "group_by": "name",
      "order_by": "name",
      "limit": limit,
      "offset": offset,
    };
  }
}

export default MainIndexer;
