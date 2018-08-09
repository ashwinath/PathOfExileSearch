//import MainIndexer from "./etl"
import DiscordBot from "./discord";

async function main() {
  // ETL
  //const mainIndexer = new MainIndexer();
  //await mainIndexer.process();

  const discordBot = new DiscordBot();
  discordBot.listen();
}

main();
