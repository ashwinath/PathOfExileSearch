import moment from "moment";
import axios from "axios";
import elasticSearchStore from "../es";
import logger from "../logger";
import querystring from "querystring";
import { CURRENCY_STACK_SIZE, LEAGUE } from "./information";
import {
  Etl,
  PoeNinjaMappings,
  PoeNinjaWithCurrencyDetailsResponse,
  PoeNinjaResponse,
  PoeNinjaItem,
} from "../interfaces";

class PoeNinjaScraper implements Etl {
  private MAPPINGS = [
    { itemType: "Fragment", hasCurrencyDetails: true },
    { itemType: "Currency", hasCurrencyDetails: true },
    { itemType: "Essence", hasCurrencyDetails: false },
    { itemType: "DivinationCard", hasCurrencyDetails: false },
    { itemType: "Prophecy", hasCurrencyDetails: false },
    { itemType: "UniqueMap", hasCurrencyDetails: false },
    { itemType: "Map", hasCurrencyDetails: false },
    { itemType: "UniqueJewel", hasCurrencyDetails: false },
    { itemType: "UniqueFlask", hasCurrencyDetails: false },
    { itemType: "UniqueWeapon", hasCurrencyDetails: false },
    { itemType: "UniqueArmour", hasCurrencyDetails: false },
    { itemType: "UniqueAccessory", hasCurrencyDetails: false },
  ]

  public async process() {
    await elasticSearchStore.sendItemMapping();
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

  /**
   * The logic for Currency and fragments are very wonky.
   *
   * This is understandable from the poe.ninja's website design.
   * So we are 2nd class citizens here.
   * For instance: currency details dont complement with fragments here.
   * So fragments should not have their information merged.
   * We will use the name for the id for both.
   * But currency will use the generated ID poe.ninja provides.
   *
   * "sparkline" for currency items and "sparkLine" for other items.
   * Notice the difference in "L" camel casing vs all lowercase.
   */
  private async downloadPoeNinjaWithCurrencyDetails(url: string, source: string) {
    try {
      const response = await axios.get<PoeNinjaWithCurrencyDetailsResponse>(url);

      const allCurrencies = {};

      const lines = response.data.lines;
      for (let i = 0; i < lines.length; ++i) {
        const line = lines[i];
        const name = line.currencyTypeName;
        let pay: number | undefined = undefined;
        if (line.pay) {
          pay = line.pay.value;
        }
        let paySparkLine: number[] | undefined = undefined;
        if (line.paySparkLine) {
          paySparkLine = line.paySparkLine.data;
        }
        let receive: number | undefined = undefined;
        if (line.receive) {
          receive = line.receive.value;
        }
        let receiveSparkLine: number[] | undefined = undefined;
        if (line.receiveSparkLine) {
          receiveSparkLine = line.receiveSparkLine.data;
        }
        const poeNinjaItem: PoeNinjaItem = {
          source,
          name,
          pay,
          paySparkline: paySparkLine,
          receive,
          receiveSparkline: receiveSparkLine,
          chaosValue: line.chaosEquivalent,
          isCurrency: true,
          stackSize: CURRENCY_STACK_SIZE[name],
        };
        allCurrencies[name] = poeNinjaItem;
      }

      const currencyDetails = response.data.currencyDetails;
      for (let i = 0; i < currencyDetails.length; ++i) {
        const currency = currencyDetails[i];
        const name = currency.name;
        const imageUrl = this.getBaseImageUrl(currency.icon);
        const poeNinjaItem: PoeNinjaItem = {
          id: name,
          name,
          source,
          imageUrl: imageUrl,
          isCurrency: true,
        }

        // IMPORTANT
        // We do not replace currency data if thats the case.
        if (name in allCurrencies) {
          allCurrencies[name] = {
            ...allCurrencies[name],
            ...poeNinjaItem,
          }
        }
      }

      for (let key in allCurrencies) {
        await elasticSearchStore.store("items", allCurrencies[key]);
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
          links: line.links,
          artFilename: line.artFilename,
          meta: {
            mapTierString: this.generateMetaMapTier(source, line.mapTier)
          }
        };

        await elasticSearchStore.store("items", poeNinjaItem);
      }
    } catch (error) {
      logger.warn(url)
      logger.warn(error.message)
    }
  }

  private getBaseImageUrl(url: string) {
    const keysToDelete = ["scaleIndex", "w", "h"];
    const imageQueryString = querystring.parse(url.split("?")[1]);
    for (let key of keysToDelete) {
      if (key in imageQueryString) {
        delete imageQueryString[key];
      }
    }
    return url.replace("http", "https") + querystring.stringify(imageQueryString);
  }

  private generateUrl(itemType: string, currency: boolean) {
    const dateString = this.generateTodaysDate();
    const resource = currency ? "currencyoverview": "itemoverview";
    return `http://poe.ninja/api/data/${resource}?league=${LEAGUE}&type=${itemType}&date=${dateString}`
  }

  private generateTodaysDate() {
    return moment().format("YYYY-MM-DD");
  }

  private generateMetaMapTier(source: string, tier: number): string | null {
    if (!tier || source !== "Map") {
      return null;
    }

    return `Tier ${tier} map`;
  }
}

export default PoeNinjaScraper;
