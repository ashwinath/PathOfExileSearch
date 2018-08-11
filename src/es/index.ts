import * as elasticsearch from "elasticsearch";
import uuidv4 from "uuid/v4";
import { EsPoeItem, EsSearchResult } from "../interfaces";

class ElasticSearchStore {
  private es = new elasticsearch.Client({
    host: process.env.ES_HOST || "localhost:9200",
    log: "info",
  });

  private DEFAULT_SORT = [
    { "requiredLevel": { "order": "desc" } },
  ];

  public async sendItemMapping() {
    try {
      await this.es.indices.create({
        index: "items",
      });

      const mapping = {
        "properties": {
          "name": { "type": "text" },
          "className": {
            "type": "keyword",
          },
          "baseItem": {
            "type": "keyword",
          },
          "implicitStatText": { "type": "text" },
          "explicitStatText": { "type": "text" },
          "dropLevel": { "type": "integer" },
          "dropLevelMaximum": { "type": "integer" },
          "requiredDexterity": { "type": "integer" },
          "requiredIntelligence": { "type": "integer" },
          "requiredLevel": { "type": "integer" },
          "requiredLevelBase": { "type": "integer" },
          "requiredStrength": { "type": "integer" },
        }
      }
      await this.es.indices.putMapping({
        index: "items",
        type: "document",
        body: mapping,
      });
    } catch(error) {
      console.error(error.message);
    }
  }

  public async store<T>(index: string, body: T) {
    try {
      await this.es.create({
        index: index,
        type: "document",
        body: body,
        id: uuidv4(),
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  public async search(searchField: string, searchString: string, size: number): Promise<EsSearchResult> {
    try {
      const matchBody = {}
      matchBody[searchField] = searchString;
      const response = await this.es.search<EsPoeItem>({
        index: "items",
        body: {
          query: {
            match_phrase: matchBody,
          },
          sort: this.DEFAULT_SORT,
        },
        size: size,
      });

      return {
        success: true,
        result: response.hits.hits.map((item) => item._source),
      }
    } catch (error) {
      console.error(error.message);
      return {
        success: false,
        error: error.message,
      }
    }
  }

  public async searchLevelRange(
    maxLevel: number, className: string, size: number): Promise<EsSearchResult> {
    console.log(maxLevel)
    console.log(className)
    try {
      const response = await this.es.search<EsPoeItem>({
        index: "items",
        body: {
          query: {
            bool: {
              must: [
                {
                  range: {
                    requiredLevel: {
                      lte: maxLevel,
                    },
                  }
                },
                { term: { "className": className } },
              ]
            }
          },
          sort: this.DEFAULT_SORT,
        },
        size: size,
      });

      return {
        success: true,
        result: response.hits.hits.map((item) => item._source),
      }
    } catch (error) {
      console.error(error.message);
      return {
        success: false,
        error: error.message,
      }
    }
  }

  // This returns a list of strings. the typing is not good for this
  public async searchDistinctFields(index: string, field: string) {
    try {
      const response = await this.es.search({
        index,
        type: "document",
        body: {
          size: 0,
          aggs: {
            aggregations: {
              terms: {
                field,
                size: 99999,
                order: { "_term": "asc" }
              },
            }
          },
        },
      });
      return response.aggregations.aggregations.buckets.map((item) => item.key)
    } catch(error) {
      console.error(error.message)
    }

  }
}

const elasticSearchStore = new ElasticSearchStore();

export default elasticSearchStore;
