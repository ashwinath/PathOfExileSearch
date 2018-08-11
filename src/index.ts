import MainIndexer from "./etl"
import DiscordBot from "./discord";
import server from "./server";

async function main() {
  const mainIndexer = new MainIndexer();
  await mainIndexer.process();

  const discordBot = new DiscordBot();
  discordBot.listen();

  server.listen(7000, () => console.log("Server started on port 7000"));
}

main();
