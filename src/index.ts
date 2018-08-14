import MainIndexer from "./etl";
import PoeNinjaScraper from "./etl/poeninja"
import server from "./server";
import logger from "./logger"

async function main() {
  const mainIndexer = new MainIndexer();
  await mainIndexer.process();

  const poeNinjaScraper = new PoeNinjaScraper();
  await poeNinjaScraper.process();

  server.listen(7000, () => logger.info("Server started on port 7000"));
}

main();
