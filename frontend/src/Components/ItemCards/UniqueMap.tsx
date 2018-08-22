import * as React from "react";
import { connect } from "react-redux";
import { SearchResultDetailsProps } from "../../Interfaces";
import { mapStateToProps } from "./ReduxMapper";
import { CardImg } from "reactstrap";
import { sanitiseFlavourText } from "./Utils";
import ImplicitKeyValue from "./ImplicitKeyValue";
import "./Cards.css";

const BASE_MAP_LEVEL = 67;

function UniqueMap(props: SearchResultDetailsProps) {
  const { item } = props;
  const size = "4vw";
  const flavourText = sanitiseFlavourText(item.flavourText || "");
  const explicit = item.explicit && item.explicit.length > 0 ? item.explicit : null;
  return (
    <div className="center item-details">
      <div className="title-header">
        <p className="header-text default-margin-bottom">{item.name}</p>
      </div>
      <div className="implicit-border">
        <ImplicitKeyValue
          implicitKey={"Map Level"}
          implicitValue={BASE_MAP_LEVEL + item.mapTier} />
        <ImplicitKeyValue
          implicitKey={"Map Tier"}
          implicitValue={item.mapTier} />
      </div>
      <hr className="line-break-item hr-margin"/>
      {explicit ? explicit.map((line) =>
        <p className="item-mod-text mod-text default-margin-bottom" key={item.id + line}>{line}</p>) : null}
      <hr className="line-break-item hr-margin"/>
      {flavourText ? flavourText.split("|").map((line) =>
        <p
          className="item-mod-text flavour-text default-margin-bottom"
          key={item.id + line}>
          {line}
          </p>) : null}
      <hr className="line-break-item hr-margin"/>
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
  )
}

export default connect(mapStateToProps)(UniqueMap);
