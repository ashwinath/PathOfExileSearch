import * as Restify from "restify";
import elasticSearchStore from "../es";

const server = Restify.createServer({
  name: "poe-search-server",
  version: '1.0.0'
});

server.use(Restify.plugins.acceptParser(server.acceptable));
server.use(Restify.plugins.queryParser());
server.use(Restify.plugins.bodyParser());

async function formPathHandler(
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

// Routes
server.get("/-/form", formPathHandler)

export default server;
