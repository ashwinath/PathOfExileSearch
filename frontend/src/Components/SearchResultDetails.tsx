import * as React from "react";
import { connect } from "react-redux";
import { CardImg } from "reactstrap";
import { SearchResultDetailsProps } from "../Interfaces";
import "./SearchResultDetails.css";

class SearchResultDetails extends React.Component<SearchResultDetailsProps, {}> {
  public render() {
    const { item } = this.props;
    if (!item) {
      return (
        <h1>Click on an item to find out more</h1>
      );
    }

    const size = "12vw";
    const implicit = item.implicit ? item.implicit.length > 0 ? item.implicit : null : null;
    const explicit = item.explicit ? item.explicit.length > 0 ? item.explicit : null : null;
    const flavourText = item.flavourText === "" ? null : item.flavourText;
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
          <p className="flavour-text default-margin-bottom" key={item.id + line}>{line}</p>) : null}
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


function mapStateToProps(state) {
  return {
    item: state.search.clickedItem,
  }
}

export default connect(mapStateToProps)(SearchResultDetails);
