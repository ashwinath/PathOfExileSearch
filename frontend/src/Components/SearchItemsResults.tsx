import * as React from "react";
import { Row, Col } from "reactstrap";
import { SearchItemsResultsProps, SearchResultsState } from "../Interfaces";
import SearchResultList from "./SearchResultList";
import SearchResultDetails from "./SearchResultDetails";

class SearchItemsResults extends React.Component<SearchItemsResultsProps, SearchResultsState> {

  constructor(props) {
    super(props);
    this.state = {
      poeItems: [],
    };
  }

  public componentDidUpdate(nextProps) {
    this.setState(() => {
      return {
        ...this.state,
        poeItems: nextProps.poeItems,
      };
    });
  }

  public shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.poeItems !== this.state.poeItems);
  }

  public render() {
    const searchResultsList = this.state.poeItems.map((item) => {
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
        <Col md="8">
          <SearchResultList searchResultsList={searchResultsList}/>
        </Col>
        <Col md="4">
          <SearchResultDetails/>
        </Col>
      </Row>
    );
  }
}

export default SearchItemsResults;
