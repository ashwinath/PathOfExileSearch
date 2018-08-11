import * as Restify from "restify";
import elasticSearchStore from "../es";
import { SearchItemRequest, FormResponse, SearchResponse } from "../interfaces"

const server = Restify.createServer({
  name: "poe-search-server",
  version: '1.0.0'
});

server.use(Restify.plugins.acceptParser(server.acceptable));
server.use(Restify.plugins.queryParser());
server.use(Restify.plugins.bodyParser());

let formCache: FormResponse = { success: false, classNames: [], baseItems: []};

async function formHandler(
  request: Restify.Request,
  response: Restify.Response,
  next: Restify.Next
) {
  if (!formCache.success) {
    const classNames = await elasticSearchStore.searchDistinctFields("items", "className");
    const baseItems = await elasticSearchStore.searchDistinctFields("items", "baseItem");
    formCache = {
      success: true,
      classNames,
      baseItems,
    }
  }
  response.send(formCache);
  return next();
}

async function searchHandler(
  request: Restify.Request,
  response: Restify.Response,
  next: Restify.Next
) {
  const body: SearchItemRequest = request.body;

  const esResponse = await elasticSearchStore.searchItem(body);

  const searchResponse: SearchResponse = {
    success: esResponse.success,
    data: esResponse.result
  }
  response.send(esResponse.success ? 200 : 500, searchResponse);
  return next();
}

// Routes
server.get("/-/form", formHandler)
server.post("/-/items/search", searchHandler)

export default server;
