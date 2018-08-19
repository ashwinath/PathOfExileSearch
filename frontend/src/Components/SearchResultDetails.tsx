import * as React from "react";
import { connect } from "react-redux";
import { CardImg } from "reactstrap";
import { SearchResultDetailsProps } from "../Interfaces";
import "./SearchResultDetails.css";

class SearchResultDetails extends React.Component<SearchResultDetailsProps, {}> {
  public render() {
    const { item } = this.props;
    if (!item) {
      return null;
    }
    const size = "12vw";
    const implicit = item.implicit ? item.implicit.length > 0 ? item.implicit : null : null;
    const explicit = item.explicit ? item.explicit.length > 0 ? item.explicit : null : null;

    // Theres a hidden \r inside
    let flavourText = item.flavourText === "" 
        && item.flavourText.replace(/\r/g, "") ? item.flavourText.replace(/\r/g, "")
        : null;

    if (typeof flavourText === "string") {
      const flavourTextMatch = flavourText.match(/\{(.*?)\}/g);
      if (flavourTextMatch !== null) {
        flavourText = flavourTextMatch[0]
          .replace("{", "")
          .replace("}", "");
      }
    }


    // Divination Card logic
    return (
      <div className="center item-details">
        <div className="title-header">
          <p className="header-text default-margin-bottom">{item.name}</p>
          <p className="header-text default-margin-bottom">{item.baseType}</p>
        </div>
        {implicit ? implicit.map((line) =>
          <p className="mod-text implicit-border default-margin-bottom" key={item.id + line}>{line}</p>) : null}
        {implicit ? <hr className="line-break-item hr-margin"/> : null}
        {explicit && item.source === "DivinationCard" ? explicit.map((line) => <DivinationCardExplict key={Math.random()} explicit={line}/>) : null}
        {explicit && item.source !== "DivinationCard" ? explicit.map((line) =>
          <p className={`mod-text default-margin-bottom ${implicit ? null : "implicit-border"}`} key={item.id + line}>{line}</p>) : null}
        {explicit ? <hr className="line-break-item hr-margin"/> : null}
        {flavourText ? flavourText.split("|").map((line) =>
          <p
            className={`flavour-text default-margin-bottom ${!implicit && !explicit ? "implicit-border" : null}`}
            key={item.id + line}>
            {line}
            </p>) : null}
        {item.flavourText ? <hr className="line-break-item hr-margin"/> : null}
        <CardImg
          style={{
            maxHeight: size,
            maxWidth: size,
            height: size,
            width: "auto",
          }}
          top={true}
          src={item.imageUrl}/>
      </div>
    );
  }

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
      <p className={`default-margin-bottom implicit-border ${cssName}`}>{text}{secondText}</p>
    );
  }

  return null;
}


function mapStateToProps(state) {
  return {
    item: state.search.clickedItem,
  }
}

export default connect(mapStateToProps)(SearchResultDetails);
