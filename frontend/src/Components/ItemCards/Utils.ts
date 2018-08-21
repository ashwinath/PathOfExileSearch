export function sanitiseFlavourText(flavourText: string) {
  // Theres a hidden \r inside
  let flavourTextMutated = flavourText !== "" && flavourText.replace(/\r/g, "") 
      ? flavourText.replace(/\r/g, "")
      : null;

  if (typeof flavourTextMutated === "string") {
    const flavourTextMatch = flavourTextMutated.match(/\{(.*?)\}/g);
    if (flavourTextMatch !== null) {
      flavourTextMutated = flavourTextMatch[0]
        .replace("{", "")
        .replace("}", "");
    }
  }

  return flavourTextMutated;
}
