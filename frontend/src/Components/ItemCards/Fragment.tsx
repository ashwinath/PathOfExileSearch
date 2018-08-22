import * as React from "react";
import { connect } from "react-redux";
import { SearchResultDetailsProps } from "../../Interfaces";
import { mapStateToProps } from "./ReduxMapper";
import { CardImg } from "reactstrap";
import "./Cards.css";

function Fragment(props: SearchResultDetailsProps) {
  const { item } = props;
  const size = "5vw";
  return (
    <div className="center map-item-details">
      <div className="map-title-header">
        <p className="map-header-text default-margin-bottom">{item.name}</p>
      </div>
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

export default connect(mapStateToProps)(Fragment);
