import * as Restify from "restify";
import * as Path from "path";
import elasticSearchStore from "../es";
import logger from "../logger";
import { SearchResponse } from "../interfaces"

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

async function searchHandler(
  request: Restify.Request,
  response: Restify.Response,
  next: Restify.Next
) {
  const requestObj = request.query;
  const searchString = requestObj["search"] || "";
  const itemLimit = requestObj["itemLimit"] || 15;
  const linksCsv = requestObj["links"] || "0,1,2,3,4,5,6";
  const links = linksCsv.split(",")
  if (searchString === "") {
    const searchResponse: SearchResponse = {
      success: true,
      data: [],
    }
    response.send(200, searchResponse);
    return next();
  }

  const searchResult = await elasticSearchStore.search("items", searchString, links, itemLimit);

  const searchResponse: SearchResponse = {
    success: searchResult.success,
    data: searchResult.result,
  }
  response.send(searchResult.success ? 200: 500, searchResponse);
  return next();
}

// Routes
server.get("/-/items/search", searchHandler)
server.get('/*', Restify.plugins.serveStatic({
  directory: Path.join(__dirname, "../public"),
  default: 'index.html',
}));

export default server;
