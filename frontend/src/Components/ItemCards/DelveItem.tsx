import * as React from "react";
import { connect } from "react-redux";
import { SearchResultDetailsProps } from "../../Interfaces";
import { mapStateToProps } from "./ReduxMapper";
import { CardImg } from "reactstrap";
import "./Cards.css";

function DelveItem(props: SearchResultDetailsProps) {
  const { item } = props;
  const size = "5vw";
  return (
    <div className="center essence-item-details">
      <div className="essence-title-header">
        <p className="essence-header-text default-margin-bottom">{item.name}</p>
      </div>
      <hr className="essence-line-break-item hr-margin"/>
      {item.explicit.map((line) =>
        <p className="item-mod-text mod-text default-margin-bottom" key={item.id + line}>{line}</p>)}
      <hr className="essence-line-break-item hr-margin"/>
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

export default connect(mapStateToProps)(DelveItem);

