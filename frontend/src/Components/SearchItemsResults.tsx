import * as React from "react";
import { Row, Col } from "reactstrap";
import { SearchItemsResultsProps, SearchResultsState } from "../Interfaces";
import SearchResultList from "./SearchResultList";
import SearchResultDetails from "./SearchResultDetails";
import { connect } from "react-redux";

class SearchItemsResults extends React.Component<SearchItemsResultsProps, SearchResultsState> {
  public render() {
    const poeItems = this.props.poeItems || [];
    const searchResultsList = poeItems.map((item) => {
      return {
        id: item.id,
        name: item.name,
        imageUrl: item.imageUrl,
        chaosValue: item.chaosValue,
        exaltedValue: item.exaltedValue,
        source: item.source,
        links: item.links,
        baseType: item.baseType,
        corrupted: item.corrupted,
        gemLevel: item.gemLevel,
        gemQuality: item.gemQuality,
      }
    });
    return (
      <Row>
        <Col md="9">
          <SearchResultList searchResultsList={searchResultsList}/>
        </Col>
        <Col md="3">
          <SearchResultDetails/>
        </Col>
      </Row>
    );
  }
}

function mapStateToProps(state) {
  const { poeItems } = state.search;
  return {
    poeItems,
  }
}

export default connect(mapStateToProps)(SearchItemsResults);
