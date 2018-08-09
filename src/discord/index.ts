import Discord from "discord.js";
import elasticSearchStore from "../es";
import { EsPoeItem } from "../interfaces";

interface Bot {
  listen(): void;
}

class DiscordBot implements Bot {
  private client = new Discord.Client();
  private HELP_MSG = `How to use: search <implicit/explicit/name/classname> <string to search>`;
  private FIELD_MAPPER = {
    "implicit": "implicitStatText",
    "explicit": "explicitStatText",
    "name": "name",
    "class": "className",
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
    this.client.on("ready", () => console.log("Discord ready to serve!"));
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
    if (!searchField) {
      return this.HELP_MSG;
    }

    tokenised.unshift();
    const searchContents = tokenised.join(" ");
    const size = searchField === "name" ? 5 : 20
    const response = await elasticSearchStore.search(searchField, searchContents, size);

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
Implicit: ${item.implicitStatText}
Explicit: ${item.explicitStatText}
        `
      });
      return allItems.join("\n");
    }
    const itemNames = items.map((item) => {
      return `- ${item.name}`
    })
    return `
RESULT:
${itemNames.join("\n")}
    `
  }

}

export default DiscordBot;
