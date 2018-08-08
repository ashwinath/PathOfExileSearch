import * as elasticsearch from "elasticsearch";
import uuidv4 from "uuid/v4";

class ElasticSearchStore {
  private es = new elasticsearch.Client({
    host: process.env.ES_HOST || "localhost:9200",
    log: "info",
  });

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
}

const elasticSearchStore = new ElasticSearchStore();

export default elasticSearchStore;
