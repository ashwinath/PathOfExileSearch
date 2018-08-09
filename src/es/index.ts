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
}

const elasticSearchStore = new ElasticSearchStore();

export default elasticSearchStore;
