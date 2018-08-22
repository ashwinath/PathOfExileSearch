import * as React from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import SearchResultList from "./SearchResultList";
import SearchResultDetails from "./SearchResultDetails";

function SearchItemsResults() {
  return (
    <Row>
      <Col md="8">
        <SearchResultList />
      </Col>
      <Col md="4">
        <SearchResultDetails />
      </Col>
    </Row>
  );
}

export default connect()(SearchItemsResults);
