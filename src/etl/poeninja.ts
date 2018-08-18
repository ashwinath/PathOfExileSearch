import moment from "moment";
import axios from "axios";
import elasticSearchStore from "../es";
import logger from "../logger";
import {
  Etl,
  PoeNinjaMappings,
  PoeNinjaWithCurrencyDetailsResponse,
  PoeNinjaResponse,
  PoeNinjaItem,
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
      await this.downloadPoeNinjaWithCurrencyDetails(url, mapping.itemType);
    } else {
      await this.downloadPoeNinja(url, mapping.itemType);
    }
    logger.info(`Finished downloading PoeNinja mapping = ${mapping.itemType}`)
  }

  private async downloadPoeNinjaWithCurrencyDetails(url: string, source: string) {
    try {
      const response = await axios.get<PoeNinjaWithCurrencyDetailsResponse>(url);
      const currencyDetails = response.data.currencyDetails;
      for (let i = 0; i < currencyDetails.length; ++i) {
        const currency = currencyDetails[i];
        const name = currency.name;
        const imageUrl = this.getBaseImageUrl(currency.icon);

        const poeNinjaItem: PoeNinjaItem = {
          id: name,
          source,
          imageUrl: imageUrl,
          isCurrency: true,
        }
        await elasticSearchStore.store("items", poeNinjaItem);
      }

      const lines = response.data.lines;
      for (let i = 0; i < lines.length; ++i) {
        const line = lines[i];
        const name = line.currencyTypeName;
        let pay: number | undefined = undefined;
        if (line.pay) {
          pay = line.pay.value;
        }
        let paySparkline: number[] | undefined = undefined;
        if (line.paySparkline) {
          paySparkline = line.paySparkline.data;
        }
        let receive: number | undefined = undefined;
        if (line.receive) {
          receive = line.receive.value;
        }
        let receiveSparkline: number[] | undefined = undefined;
        if (line.receiveSparkline) {
          receiveSparkline = line.receiveSparkline.data;
        }
        const poeNinjaItem: PoeNinjaItem = {
          id: name,
          source,
          name,
          pay,
          paySparkline,
          receive,
          receiveSparkline,
          chaosValue: line.chaosEquivalent,
          isCurrency: true,
        };
        await elasticSearchStore.store("items", poeNinjaItem);
      }
    } catch (error) {
      logger.error(error.message)
    }

  }

  private async downloadPoeNinja(url: string, source: string) {
    try {
      const response = await axios.get<PoeNinjaResponse>(url);
      const lines = response.data.lines;
      for (let i = 0; i < lines.length; ++i) {
        const line = lines[i];

        let name: string | undefined = undefined;
        if (line.name) {
          name = line.name
        } else if (line.currencyTypeName) {
          name = line.currencyTypeName;
        } else {
          continue;
        }

        const imageUrl = this.getBaseImageUrl(line.icon);
        let sparkline: number[] | undefined = undefined;
        if (line.sparkline) {
          sparkline = line.sparkline.data;
        }
        const chaosValue = line.chaosValue;
        const exaltedValue = line.exaltedValue;
        const id = "" + line.id;

        const poeNinjaItem: PoeNinjaItem = {
          id,
          source,
          name,
          imageUrl,
          sparkline,
          chaosValue,
          exaltedValue,
          isCurrency: false,
          mapTier: line.mapTier,
          levelRequired: line.levelRequired,
          baseType: line.baseType,
          stackSize: line.stackSize,
          prophecyText: line.prophecyText,
          implicit: line.implicitModifiers.map((mod) => mod.text),
          explicit: line.explicitModifiers.map((mod) => mod.text),
          flavourText: line.flavourText,
          corrupted: line.corrupted,
          gemLevel: line.gemLevel,
          gemQuality: line.gemQuality,
          itemType: line.itemType,
        }

        await elasticSearchStore.store("items", poeNinjaItem);
      }
    } catch (error) {
      logger.warn(url)
      logger.warn(error.message)
    }
  }

  private getBaseImageUrl(url: string) {
    return url.split("?")[0].replace("http", "https");
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
