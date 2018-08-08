import axios from "axios";
import elasticSearchStore from "../es";

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

interface EsPoeItem {
  name: string;
  className: string;
  baseItem: string;
  implicitStatText: string;
  explicitStatText: string;
  dropLevel: number;
  dropLevelMaximum: number;
  requiredDexterity: number
  requiredIntelligence: number;
  requiredLevel: number;
  requiredLevelBase: number;
  requiredStrength: number;
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
    let limit = 50;
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
    return {
      name: poeItem.title["name"],
      className: poeItem.title["class"],
      baseItem: poeItem.title["base item"],
      implicitStatText: poeItem.title["implicit stat text"],
      explicitStatText: poeItem.title["explicit stat text"],
      dropLevel: poeItem.title["drop level"],
      dropLevelMaximum: poeItem.title["drop level maximum"],
      requiredDexterity: poeItem.title["required dexterity"],
      requiredIntelligence: poeItem.title["required intelligence"],
      requiredLevel: poeItem.title["required level"],
      requiredLevelBase: poeItem.title["required level base"],
      requiredStrength: poeItem.title["required strength"],
    }
  }

  private constructParams(limit: number, offset: number): PoeWikiParams {
    return {
      'action': 'cargoquery',
      "format": "json",
      'tables': 'items',
      'fields': this.PROJECTIONS.join(","),
      "group_by": "name",
      "order_by": "name",
      "limit": limit,
      "offset": offset,
    };
  }
}

export default MainIndexer;
