//import MainIndexer from "./etl"
import DiscordBot from "./discord";
import server from "./server";
import logger from "./logger"

async function main() {
  //const mainIndexer = new MainIndexer();
  //await mainIndexer.process();

  const discordBot = new DiscordBot();
  discordBot.listen();

  server.listen(7000, () => logger.info("Server started on port 7000"));
}

main();
