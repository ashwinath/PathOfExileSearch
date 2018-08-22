import PoeNinjaScraper from "./etl/poeninja"
import server from "./server";
import logger from "./logger"

const TIME_INTERVAL = 1000 * 60 * 60;

async function main() {
  const poeNinjaScraper = new PoeNinjaScraper();
  poeNinjaScraper.process();
  // Needs to run every hour
  setInterval(() => poeNinjaScraper.process(), TIME_INTERVAL);

  server.listen(7000, () => logger.info("Server started on port 7000"));
}

main();
