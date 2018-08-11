import * as Restify from "restify";
import elasticSearchStore from "../es";
import { SearchItemRequest } from "../interfaces"

const server = Restify.createServer({
  name: "poe-search-server",
  version: '1.0.0'
});

server.use(Restify.plugins.acceptParser(server.acceptable));
server.use(Restify.plugins.queryParser());
server.use(Restify.plugins.bodyParser());

async function formHandler(
  request: Restify.Request,
  response: Restify.Response,
  next: Restify.Next
) {

  const classNames = await elasticSearchStore.searchDistinctFields("items", "className");
  const baseItems = await elasticSearchStore.searchDistinctFields("items", "baseItem");
  response.send({
    classNames,
    baseItems,
  });
  return next();
}

async function searchHandler(
  request: Restify.Request,
  response: Restify.Response,
  next: Restify.Next
) {
  const body: SearchItemRequest = request.body;

  const esResponse = await elasticSearchStore.searchItem(body);
  if (esResponse.success) {
    response.send({
      success: true,
      data: esResponse.result,
    });
  } else {
    response.send(500, {
      success: false,
      data: [],
    });

  }
  return next();
}

// Routes
server.get("/-/form", formHandler)
server.post("/-/items/search", searchHandler)

export default server;
