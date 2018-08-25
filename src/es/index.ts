import * as elasticsearch from "elasticsearch";
import logger from "../logger";
import {
  EsSearchResult,
  EsItem,
  PoeNinjaItem,
} from "../interfaces";

class ElasticSearchStore {
  private es = new elasticsearch.Client({
    host: process.env.ES_HOST || "localhost:9200",
    log: "info",
  });

  public async sendItemMapping() {
    try {
      await this.es.indices.create({
        index: "items",
      });

      const mapping = {
        "properties": {
          "name": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
              }
            }
          },
          "className": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
              }
            }
          },
          "baseType": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
              }
            }
          },
          "implicit": {
            "type": "text",
            "position_increment_gap": 100,
          },
          "explicit": {
            "type": "text",
            "position_increment_gap": 100,
          },
          "levelRequired": { "type": "integer" },
          "receive": { "type": "float" },
          "pay": { "type": "float" },
          "mapTier": { "type": "float" },
          "stackSize": { "type": "integer" },
          "prophecyText": { "type": "text" },
          "chaosValue": { "type": "float" },
          "exaltedValue": { "type": "float" },
          "flavourText": { "type": "text" },
          "corrupted": { "type": "boolean" },
          "gemLevel": { "type": "integer" },
          "gemQuality": { "type": "integer" },
          "itemType": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
              }
            }
          },
          "links": { "type": "integer" },
          "source": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
              }
            }
          },
        }
      }
      await this.es.indices.putMapping({
        index: "items",
        type: "document",
        body: mapping,
      });
    } catch(error) {
      logger.error(error.message);
    }
  }

  public async store(index: string, body: EsItem) {
    try {
      await this.es.index({
        index: index,
        type: "document",
        body: body,
        id: body.id,
      });
    } catch (error) {
      logger.error(error.message);
    }
  }

  public async search(
    index: string,
    searchString: string,
    links: number[],
    itemCount: number
  ): Promise<EsSearchResult> {
    try {
      const response = await this.es.search<PoeNinjaItem>({
        index,
        size: itemCount,
        body: {
          sort: [
            "_score",
            { "name.keyword" : { order: "asc" } },
            { gemLevel : { order: "desc" } },
            { gemQuality : { order: "desc" } },
            { links : { order: "desc" } },
            { corrupted : { order: "asc" } },
            { chaosValue : { order: "asc" } },
          ],
          query: {
            bool: {
              filter: [
                {
                  terms: {
                    links,
                  }
                }
              ],
              should: [
                {
                  match_phrase_prefix: {
                    name: searchString,
                  },
                },
                {
                  match: {
                    name: {
                      query: searchString,
                      fuzziness: 2,
                      prefix_length: 5,
                    }
                  }
                },
                {
                  match_phrase: {
                    implicit: {
                      query: searchString,
                    }
                  }
                },
                {
                  match_phrase: {
                    explicit: {
                      query: searchString,
                    }
                  }
                },
                {
                  match: {
                    implicit: {
                      query: searchString,
                      fuzziness: 2,
                      prefix_length: 5,
                    }
                  }
                },
                {
                  match: {
                    explicit: {
                      query: searchString,
                      fuzziness: 2,
                      prefix_length: 5,
                    }
                  }
                },
                {
                  match: {
                    itemType: {
                      query: searchString,
                      fuzziness: 2,
                      prefix_length: 5,
                    }
                  }
                },
                {
                  match: {
                    baseType: {
                      query: searchString,
                      fuzziness: 2,
                      prefix_length: 5,
                    }
                  }
                },
                {
                  match: {
                    flavourText: {
                      query: searchString,
                      fuzziness: 2,
                      prefix_length: 5,
                    }
                  }
                }
              ]
            }
          }
        }
      });
      return  {
        success: true,
        result: response.hits.hits.map((item) => item._source),
      }
    } catch (error) {
      logger.error(error.message)
      return {
        success: false,
        result: [],
        error: error.message,
      }
    }
  }

}

const elasticSearchStore = new ElasticSearchStore();

export default elasticSearchStore;
