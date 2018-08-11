import axios from "axios";
import striptags from "striptags";
import elasticSearchStore from "../es";
import { EsPoeItem } from "../interfaces";

interface Etl {
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
    "implicit_stat_text",
    "explicit_stat_text",
    "drop_level",
    "drop_level_maximum",
    "required_dexterity",
    "required_intelligence",
    "required_level",
    "required_level_base",
    "required_strength",
    "base_item",
  ];

  public async process() {
    await elasticSearchStore.sendItemMapping();

    let limit = 100;
    let offset = 0;
    for (;;) {
      console.log(`Downloading from offset=${offset}, limit=${limit}`)
      const response = await axios.get<PoeWikiResponse>(this.WIKI_BASE_URL, {
        params: this.constructParams(limit, offset)
      });

      if (response.status !== 200) {
        break;
      }

      const { cargoquery } = response.data
      if (cargoquery.length === 0) {
        break;
      }

      console.log(`Persisting into ElasticSearch from offset=${offset}, limit=${limit}`)
      const allMarshalledItems = cargoquery.map(this.poeItemMapper);
      allMarshalledItems.forEach(item => elasticSearchStore.store("items", item));

      offset += limit;
      console.log(`Done, offset=${offset}, limit=${limit}`)
    }
  }

  private poeItemMapper(poeItem: PoeItemsTitle): EsPoeItem {
    const explicitCleaned = poeItem.title["explicit stat text"]
      .replace(/\&lt\;/g, "<").replace(/\&gt\;/g, ">");
    const explicit = striptags(explicitCleaned, [], "\n");
    return {
      name: poeItem.title["name"],
      className: poeItem.title["class"],
      baseItem: poeItem.title["base item"],
      implicitStatText: poeItem.title["implicit stat text"],
      explicitStatText: explicit,
      dropLevel: parseInt(poeItem.title["drop level"], 10),
      dropLevelMaximum: parseInt(poeItem.title["drop level maximum"], 10),
      requiredDexterity: parseInt(poeItem.title["required dexterity"], 10),
      requiredIntelligence: parseInt(poeItem.title["required intelligence"], 10),
      requiredLevel: parseInt(poeItem.title["required level"], 10),
      requiredLevelBase: parseInt(poeItem.title["required level base"], 10),
      requiredStrength: parseInt(poeItem.title["required strength"], 10),
    }
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
