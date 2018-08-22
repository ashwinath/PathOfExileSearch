import moment from "moment";
import axios from "axios";
import elasticSearchStore from "../es";
import logger from "../logger";
import querystring from "querystring";
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
    { itemType: "Fragment", hasCurrencyDetails: true },
    { itemType: "Currency", hasCurrencyDetails: true },
    { itemType: "Essence", hasCurrencyDetails: false },
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

  private CURRENCY_STACK_SIZE = {
    "Divine Orb": 10,
    "Portal Scroll": 40,
    "Exalted Orb": 10,
    "Ancient Orb": 20,
    "Orb of Scouring": 30,
    "Orb of Binding": 20,
    "Splinter of Tul": 100,
    "Blacksmith's Whetstone": 20,
    "Armourer's Scrap": 40,
    "Orb of Transmutation": 40,
    "Orb of Horizons": 20,
    "Blessing of Xoph": 10,
    "Engineer's Orb": 20,
    "Splinter of Chayula": 100,
    "Gemcutter's Prism": 20,
    "Splinter of Xoph": 100,
    "Cartographer's Chisel": 20,
    "Blessed Orb": 20,
    "Jeweller's Orb": 20,
    "Orb of Alteration": 20,
    "Orb of Augmentation": 30,
    "Mirror of Kalandra": 10,
    "Blessing of Chayula": 10,
    "Master Cartographer's Sextant": 10,
    "Blessing of Esh": 10,
    "Journeyman Cartographer's Sextant": 10,
    "Blessing of Tul": 10,
    "Regal Orb": 10,
    "Orb of Fusing": 20,
    "Splinter of Esh": 100,
    "Orb of Chance": 20,
    "Perandus Coin": 1000,
    "Scroll of Wisdom": 40,
    "Mirror Shard": 20,
    "Harbinger's Orb": 20,
    "Orb of Annulment": 20,
    "Blessing of Uul-Netol": 10,
    "Exalted Shard": 20,
    "Vaal Orb": 10,
    "Apprentice Cartographer's Sextant": 10,
    "Orb of Regret": 40,
    "Orb of Alchemy": 10,
    "Silver Coin": 30,
    "Splinter of Uul-Netol": 100,
    "Glassblower's Bauble": 20,
    "Chromatic Orb": 20,
  }

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
          stackSize: this.CURRENCY_STACK_SIZE[name],
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
        }

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
    return `http://poe.ninja/api/data/${resource}?league=${this.LEAGUE}&type=${itemType}&date=${dateString}`
  }

  private generateTodaysDate() {
    return moment().format("YYYY-MM-DD");
  }
}

export default PoeNinjaScraper;
