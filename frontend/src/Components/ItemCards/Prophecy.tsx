import * as React from "react";
import { connect } from "react-redux";
import { CardImg } from "reactstrap";
import { SearchResultDetailsProps } from "../../Interfaces";
import { mapStateToProps } from "./ReduxMapper";
import { sanitiseFlavourText } from "./Utils";
import "./Cards.css";

function Prophecy(props: SearchResultDetailsProps) {
  const { item } = props;
  const size = "4vw";
  const styles = {
    maxHeight: size,
    maxWidth: size,
    height: size,
    width: "auto",
  };
  const flavourText = sanitiseFlavourText(item.flavourText || "");
  return (
    <div className="center prophecy-item-details">
      <div className="prophecy-title-header">
        <p className="prophecy-header-text default-margin-bottom">{item.name}</p>
      </div>
      {flavourText ? flavourText.split("|").map((line) =>
        <p
          className="item-mod-text flavour-text default-margin-bottom"
          key={item.id + line}>
          {line}
          </p>) : null}
      <hr className="prophecy-line-break-item hr-margin"/>
      <p className="item-mod-text prophecy-text">{item.prophecyText}</p>
      <hr className="prophecy-line-break-item hr-margin"/>
      <CardImg
        style={styles}
        top={true}
        src={item.imageUrl}/>
    </div>
  );
}

export default connect(mapStateToProps)(Prophecy);
