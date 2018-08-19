import * as React from "react";
import { connect } from "react-redux";
import { Row, Col, CardImg } from "reactstrap";
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

    const size = "20vh";
    return (
      <Row
        className="d-flex align-items-center center item-details">
        <Col xs="6" md="12">
          <CardImg
            style={{
              maxHeight: size,
              maxWidth: size,
              height: size,
              width: "auto",
            }}
            top={true}
            src={item.imageUrl}/>
        </Col>
        <Col xs="6" md="12">
          <h2>{item.name}</h2>
          {item.implicit ? item.implicit.map((line) => <p key={item.id + line}>{line}</p>) : null}
          {item.explicit ? item.explicit.map((line) => <p key={item.id + line}>{line}</p>) : null}
        </Col>
      </Row>
    );
  }
}

function mapStateToProps(state) {
  return {
    item: state.search.clickedItem,
  }
}

export default connect(mapStateToProps)(SearchResultDetails);
