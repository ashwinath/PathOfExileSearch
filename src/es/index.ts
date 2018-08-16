import * as elasticsearch from "elasticsearch";
import logger from "../logger";
import {
  //EsSearchResult,
  //SearchItemRequest,
  EsItem,
} from "../interfaces";

class ElasticSearchStore {
  private es = new elasticsearch.Client({
    host: process.env.ES_HOST || "localhost:9200",
    log: "info",
  });

  //private DEFAULT_SORT = [
    //{ "requiredLevel": { "order": "desc" } },
  //];

  public async sendItemMapping() {
    try {
      await this.es.indices.create({
        index: "items",
      });

      const mapping = {
        "properties": {
          "name": { "type": "text" },
          "className": { "type": "keyword", },
          "baseType": { "type": "keyword", },
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
          "gemLevel": { "type": "number" },
          "gemQuality": { "type": "integer" },
          "itemType": { "type": "keyword" },
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

  //public async search(searchField: string, searchString: string, size: number): Promise<EsSearchResult> {
    //try {
      //const matchBody = {}
      //matchBody[searchField] = searchString;
      //const response = await this.es.search<EsPoeItem>({
        //index: "items",
        //body: {
          //query: {
            //match_phrase: matchBody,
          //},
          //sort: this.DEFAULT_SORT,
        //},
        //size: size,
      //});

      //return {
        //success: true,
        //result: response.hits.hits.map((item) => item._source),
      //}
    //} catch (error) {
      //logger.error(error.message);
      //return {
        //success: false,
        //result: [],
        //error: error.message,
      //}
    //}
  //}

  //public async searchLevelRange(
    //maxLevel: number, className: string, size: number): Promise<EsSearchResult> {
    //try {
      //const response = await this.es.search<EsPoeItem>({
        //index: "items",
        //body: {
          //query: {
            //bool: {
              //must: [
                //{
                  //range: {
                    //requiredLevel: {
                      //lte: maxLevel,
                    //},
                  //}
                //},
                //{ term: { "className": className } },
              //]
            //}
          //},
          //sort: this.DEFAULT_SORT,
        //},
        //size: size,
      //});

      //return {
        //success: true,
        //result: response.hits.hits.map((item) => item._source),
      //}
    //} catch (error) {
      //logger.error(error.message);
      //return {
        //success: false,
        //result: [],
        //error: error.message,
      //}
    //}
  //}

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
      return response.aggregations.aggregations.buckets.map((item) => item.key).filter((item) => item.key !== "")
    } catch(error) {
      logger.error(error.message)
    }
  }

  //public async searchItem(request: SearchItemRequest): Promise<EsSearchResult> {
    //try {
      //const response = await this.es.search<EsPoeItem>({
        //index: "items",
        //type: "document",
        //body: {
          //size: 10,
          //query: {
            //bool: {
              //must: this.mapToTerms(request)
            //}
          //}
        //}
      //});
      //return {
        //success: true,
        //result: response.hits.hits.map((item) => item._source),
      //}
    //} catch (error) {
      //logger.error(error.message)
      //return {
        //success: false,
        //result: [],
        //error: error.message,
      //}
    //}
  //}

  //private mapToTerms(request: SearchItemRequest) {
    //const allowedTerms = [
      //"name",
      //"className",
      //"baseTypes",
      //"mods",
      //"requiredLevel",
    //];

    //const intermediate: any[] = [] ;
    //for (let key in request) {
      //if (!allowedTerms.includes(key)) {
        //logger.info("here")
        //continue;
      //}

      //const value = request[key];
      //const currentTerm = {};

      //if (key === "requiredLevel") {
        //currentTerm[key] = {
          //gte: value,
        //}
        //if (value) {
          //intermediate.push({ range: currentTerm });
        //}
      //} else if (key === "className" || key === "baseItem") {
        //currentTerm[key] = value;
        //if (value) {
          //intermediate.push({ term: currentTerm });
        //}
      //} else if (key === "name") {
        //currentTerm[key] = value;
        //if (value) {
          //intermediate.push({ match_phrase_prefix: currentTerm });
        //}
      //} else {
        //currentTerm[key] = value;
        //if (value) {
          //intermediate.push({ match: currentTerm });
        //}
      //}
    //}
    //return intermediate;
  //}
}

const elasticSearchStore = new ElasticSearchStore();

export default elasticSearchStore;
