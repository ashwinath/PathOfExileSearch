const mappings = {
  "Currency": "Currency",
  "Fragment": "Fragment",
  "DivinationCard": "Divination Card",
  "Prophecy": "Prophecy",
  "SkillGem": "Skill Gem",
  "HelmetEnchant": "Helmet Enchantment",
  "UniqueMap": "Unique Map",
  "Map": "Map",
  "UniqueJewel": "Unique Jewel",
  "UniqueFlask": "Unique Flask",
  "UniqueWeapon": "Unique Weapon",
  "UniqueArmour": "Unique Armour",
  "UniqueAccessory": "Unique Accessory",
}

export function mapSourceToName(source: string) {
  return mappings[source];
}
