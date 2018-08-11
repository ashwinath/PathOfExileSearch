import * as Restify from "restify";
import * as Path from "path";
import elasticSearchStore from "../es";
import logger from "../logger";
import { SearchItemRequest, FormResponse, SearchResponse } from "../interfaces"

const server = Restify.createServer({
  name: "poe-search-server",
  version: '1.0.0'
});

server.on('after', Restify.plugins.auditLogger({
  log: logger,
  event: "after",
}));
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
server.get('/*', Restify.plugins.serveStatic({
  directory: Path.join(__dirname, "public"),
  default: 'index.html',
}));

export default server;
