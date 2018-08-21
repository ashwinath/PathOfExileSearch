import * as React from "react";
import { connect } from "react-redux";
import { SearchResultDetailsProps } from "../../Interfaces";
import { mapStateToProps } from "./ReduxMapper";
import { sanitiseFlavourText } from "./Utils";
import { CardImg } from "reactstrap";
import "./Cards.css";

function DivinationCard(props: SearchResultDetailsProps) {
  const { item } = props;
  const explicit = item.explicit && item.explicit.length > 0 ? item.explicit : null;
  const flavourText = sanitiseFlavourText(item.flavourText || "");
  return (
    <div className="center divination-item-details">
      <div className="divination-title-header">
        <p className="divination-header-text default-margin-bottom">{item.name}</p>
      </div>
      <CardImg
        style={{
          height: "auto",
          width: "100%",
        }}
        top={true}
        src={generateUrl(item.artFilename)}/>
      <div className="divination-card-explicit">
        {explicit ? explicit.map((line) =>
          <DivinationCardExplict key={Math.random()} explicit={line}/>) : null}
      </div>
      <hr className="line-break-item hr-margin"/>
      <div className="divination-card-flavour-text-gap">
        {flavourText ? flavourText.split("|").map((line) =>
          <p
            className={`item-mod-text flavour-text default-margin-bottom ${!explicit ? "implicit-border" : null}`}
            key={item.id + line}>
            {line}
            </p>) : null}
      </div>
    </div>
  );
}

function generateUrl(artFileName: string) {
  return `https://web.poecdn.com/image/gen/divination_cards/${artFileName}.png`
}

interface DivinationCardExplictProps {
  explicit: string;
}

function DivinationCardExplict(props: DivinationCardExplictProps) {
  const { explicit } = props;
  if (typeof explicit === "string") {
    const angleBracketsRegex = /\<(.*?)\>/g;
    const itemType = explicit.match(angleBracketsRegex)[0].replace("<", "").replace(">", "");

    const bracesRegex = /\{(.*?)\}/g;
    const text = explicit.match(bracesRegex)[0].replace("{", "").replace("}", "");

    // Just gonna hard code till 2nd pair
    let secondText = null;
    if (explicit.match(bracesRegex).length > 1) {
      const otherText = explicit.match(bracesRegex)[1].replace("{", "").replace("}", "");
      secondText = <span className="divination-card-whiteitem"> {otherText}</span>
    }

    let cssName = "";
    switch (itemType) {
      case "divination":
        cssName = "divination-card-divination-card";
        break;
      case "prophecy":
        cssName = "divination-card-prophecy"
        break;
      case "whiteitem":
        cssName = "divination-card-whiteitem";
        break;
      case "uniqueitem":
        cssName = "divination-card-uniqueitem";
        break;
      case "corrupted":
        cssName = "divination-card-corrupted";
        break;
      case "currencyitem":
        cssName = "divination-card-currencyitem";
        break;
      case "default":
        /* fall through */
      default:
        cssName = "divination-card-default";
        break;
    }
    return (
      <p className={`item-mod-text default-margin-bottom implicit-border ${cssName}`}>
        {text}{secondText}
      </p>
    );
  }

  return null;
}

export default connect(mapStateToProps)(DivinationCard);
