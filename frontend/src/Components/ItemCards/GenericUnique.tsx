import * as React from "react";
import { connect } from "react-redux";
import { CardImg } from "reactstrap";
import { SearchResultDetailsProps } from "../../Interfaces";
import { mapStateToProps } from "./ReduxMapper";
import { sanitiseFlavourText } from "./Utils";
import "./Cards.css";

function GenericUnique(props: SearchResultDetailsProps) {
  const { item } = props;
  if (!item) {
    return null;
  }

  let size = "12vw";
  let styles = {
    maxHeight: size,
    maxWidth: size,
    height: size,
    width: "auto",
  }
  switch(item.source) {
    case "UniqueFlask":
      size = "9vw";
      break;
    case "UniqueAccessory":
      size =" 6vw";
      styles = {
        maxHeight: size,
        maxWidth: size,
        height: "auto",
        width: "100%",
      }
      break;
    default:
      break;
  }
  const implicit = item.implicit && item.implicit.length > 0 ? item.implicit : null;
  const explicit = item.explicit && item.explicit.length > 0 ? item.explicit : null;

  const flavourText = sanitiseFlavourText(item.flavourText || "");

  return (
    <div className="center item-details">
      <div className="title-header">
        <p className="header-text default-margin-bottom">{item.name}</p>
        <p className="header-text default-margin-bottom">{item.baseType}</p>
      </div>
      {implicit ? implicit.map((line) =>
        <p className="mod-text implicit-border default-margin-bottom" key={item.id + line}>{line}</p>) : null}
      {implicit ? <hr className="line-break-item hr-margin"/> : null}
      {explicit ? explicit.map((line) =>
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
        style={styles}
        top={true}
        src={item.imageUrl}/>
    </div>
  );
}

export default connect(mapStateToProps)(GenericUnique);
