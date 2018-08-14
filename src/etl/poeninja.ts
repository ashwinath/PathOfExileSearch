import { Etl } from "./";
import moment from "moment";
import axios from "axios";
import elasticSearchStore from "../es";
import logger from "../logger";
import {
  PoeNinjaMappings,
  PoeNinjaWithCurrencyDetailsResponse,
  PoeNinjaResponse
} from "../interfaces";

class PoeNinjaScraper implements Etl {
  private LEAGUE = "Incursion";

  private MAPPINGS = [
    { itemType: "Currency", hasCurrencyDetails: true },
    { itemType: "Fragment", hasCurrencyDetails: true },
    { itemType: "DivinationCard", hasCurrencyDetails: false },
    { itemType: "Prophecy", hasCurrencyDetails: false },
    { itemType: "SkillGem", hasCurrencyDetails: false },
    { itemType: "HelmetEnchant", hasCurrencyDetails: false },
    { itemType: "UniqueMap", hasCurrencyDetails: false },
    { itemType: "Map", hasCurrencyDetails: false },
    { itemType: "UniqueJewel", hasCurrencyDetails: false },
    { itemType: "UniqueFlask", hasCurrencyDetails: false },
    { itemType: "UniqueWeapon", hasCurrencyDetails: false },
    { itemType: "UniqueArmour", hasCurrencyDetails: false },
    { itemType: "UniqueAccessory", hasCurrencyDetails: false },
  ]

  public async process() {
    // Else we download
    // Don't hit their server all at once.
    logger.info("Downloading Poe Ninja items.")
    for (let i = 0; i < this.MAPPINGS.length; ++i) {
      const mapping = this.MAPPINGS[i];
      await this.downloadEach(mapping);
    }
    logger.info("Done downloading Poe Ninja items.")
  }

  private async downloadEach(mapping: PoeNinjaMappings) {
    logger.info(`Downloading PoeNinja mapping = ${mapping.itemType}`)
    const url = this.generateUrl(mapping.itemType, mapping.hasCurrencyDetails);
    if (mapping.hasCurrencyDetails) {
      await this.downloadPoeNinjaWithCurrencyDetails(url);
    } else {
      await this.downloadPoeNinja(url);
    }
    logger.info(`Finished downloading PoeNinja mapping = ${mapping.itemType}`)
  }

  private async downloadPoeNinjaWithCurrencyDetails(url: string) {
    try {
      const response = await axios.get<PoeNinjaWithCurrencyDetailsResponse>(url);
      const currencyDetails = response.data.currencyDetails;
      for (let i = 0; i < currencyDetails.length; ++i) {
        const currency = currencyDetails[i];
        const name = currency.name;
        const imageUrl = this.getBaseImageUrl(currency.icon);
        const poeNinjaItem = {
          name,
          imageUrl,
        };
        await elasticSearchStore.updateItemIndex(poeNinjaItem);
      }

      const lines = response.data.lines;
      for (let i = 0; i < lines.length; ++i) {
        const line = lines[i];
        const name = line.currencyTypeName;
        let pay: number | null = null;
        if (line.pay) {
          pay = line.pay.value;
        }
        const paySparkLine = line.paySparkLine.data;
        let receive: number | null = null;
        if (line.receive) {
          receive = line.receive.value;
        }
        const receiveSparkLine = line.receiveSparkLine.data;
        const poeNinjaItem = {
          name,
          pay,
          paySparkLine,
          receive,
          receiveSparkLine,
        };
        await elasticSearchStore.updateItemIndex(poeNinjaItem);
      }
    } catch (error) {
      logger.error(error.message)
    }

  }

  private async downloadPoeNinja(url: string) {
    try {
      const response = await axios.get<PoeNinjaResponse>(url);
      const lines = response.data.lines;
      for (let i = 0; i < lines.length; ++i) {
        const line = lines[i];

        let name: string | null = null;
        if (line.name) {
          name = line.name
        } else if (line.currencyTypeName) {
          name = line.currencyTypeName;
        } else {
          continue;
        }

        const imageUrl = this.getBaseImageUrl(line.icon);
        let sparkLine: number[] | null = null;
        if (line.sparkline) {
          sparkLine = line.sparkline.data;
        }
        const chaosValue = line.chaosValue;
        const exaltedValue = line.exaltedValue;

        const poeNinjaItem = {
          name,
          imageUrl,
          sparkLine,
          chaosValue,
          exaltedValue,
        }

        await elasticSearchStore.updateItemIndex(poeNinjaItem);
      }
    } catch (error) {
      logger.warn(url)
      logger.warn(error.message)
    }
  }

  private getBaseImageUrl(url: string) {
    return url.split("?")[0]
  }

  private generateUrl(itemType: string, currency: boolean) {
    const dateString = this.generateTodaysDate();
    const resource = currency ? "currencyoverview": "itemoverview";
    return `http://poe.ninja/api/data/${resource}?league=${this.LEAGUE}&type=${itemType}&date=${dateString}`
  }

  private generateTodaysDate() {
    return moment().format("YYYY-MM-DD");
  }
}

export default PoeNinjaScraper;
