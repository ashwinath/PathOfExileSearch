import * as React from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import SearchResultList from "./SearchResultList";
import SearchResultDetails from "./SearchResultDetails";

function SearchItemsResults() {
  return (
    <Row>
      <Col md="9">
        <SearchResultList />
      </Col>
      <Col md="3">
        <div style={{paddingRight: "10px"}}>
          <SearchResultDetails />
        </div>
      </Col>
    </Row>
  );
}

export default connect()(SearchItemsResults);
