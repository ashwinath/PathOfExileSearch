import Discord from "discord.js";
import elasticSearchStore from "../es";
import logger from "../logger";
import { EsPoeItem } from "../interfaces";

interface Bot {
  listen(): void;
}

class DiscordBot implements Bot {
  private client = new Discord.Client();
  private HELP_MSG = `
How to use:
search <implicit/explicit/name> <string to search>
search <level> <classname (plural)> <number>
  `;
  private FIELD_MAPPER = {
    "name": "name",
    "level": "requiredLevel",
  }

  constructor() {
    this.initBot();
    this.onMessage = this.onMessage.bind(this);
    this.search = this.search.bind(this);
  }

  public listen() {
    this.client.on("message", this.onMessage);
  }

  private initBot() {
    this.client.on("ready", () => logger.info("Discord ready to serve!"));
    this.client.login(process.env.DISCORD_TOKEN);
  }

  private async onMessage(message: Discord.Message) {
    if (!message.isMentioned(this.client.user)) {
      return;
    }
    const tokenised = message.content.split(" ");
    tokenised.shift(); // pop out mention

    if (tokenised.length <= 1) {
      message.reply(this.HELP_MSG);
      return;
    }

    const command = tokenised[0];
    tokenised.shift();

    switch (command) {
      case "search":
        const response = await this.search(tokenised);
        message.reply(response);
        break;
      default:
        message.reply(this.HELP_MSG);
    }

  }

  private async search(tokenised: string[]) {
    const searchField = this.FIELD_MAPPER[tokenised[0]]
    tokenised.shift()
    if (!searchField) {
      return this.HELP_MSG;
    }

    const size = searchField === "name" ? 5 : 20
    let response;
    if (searchField === "requiredLevel") {
      if (tokenised.length < 2) {
        return this.HELP_MSG;
      }
      const className = tokenised[0];
      const levelLimit = tokenised[1];

      response = await elasticSearchStore.searchLevelRange(parseInt(levelLimit, 10), className, size);
    } else {
      const searchContents = tokenised.join(" ");
      response = await elasticSearchStore.search(searchField, searchContents, size);
    }

    if (response.success && response.result) {
      return this.marshalItemContent(response.result, searchField === "name");
    }
    return response.error;
  }

  private marshalItemContent(items: EsPoeItem[], formatFull=false) {
    if (items.length === 0) {
      return "Found nothing.";
    }

    if (formatFull) {
      const allItems = items.map((item) => {
        return `
Name: ${item.name}
Class: ${item.className}
Level: ${item.requiredLevel}
Strength: ${item.requiredStrength}
Dexterity: ${item.requiredDexterity}
Intelligence: ${item.requiredIntelligence}
        `
      });
      return allItems.join("\n");
    }
    const itemNames = items.map((item) => {
      return `- ${item.name} - Level ${item.requiredLevel}`
    })
    return `
RESULT:
${itemNames.join("\n")}
    `
  }

}

export default DiscordBot;
