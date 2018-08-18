import * as React from "react";
import { SearchResultListProps, SearchResultListItem } from "../Interfaces";
import { Row, Col, CardImg } from "reactstrap";
import "./SearchResultList.css";

class SearchResultList extends React.Component<SearchResultListProps, {}> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <div className="result-list">
        {this.props.searchResultsList.map((item) => {
          return (
            <SearchResultItem key={"" + item.id + "result"} {...item}/>
          )
        })}
      </div>
    )
  }
}

const sourcesWithLinkableSockets = [
  "UniqueWeapon",
  "UniqueArmour",
];

function SearchResultItem(props: SearchResultListItem) {
  const {
    name,
    imageUrl,
    chaosValue,
    exaltedValue,
    source,
    links,
  } = props;
  const size = "90px";
  let linkedText = "";
  if (sourcesWithLinkableSockets.indexOf(source) >= 0) {
    linkedText = links === 0 ? "0-4 linked" : `${links}-linked`;
  }

  return (
    <Row className="d-flex align-items-center item-container">
      <Col className="center" ms="2">
        <CardImg
          style={{
            maxHeight: size,
            maxWidth: size,
            height: size,
            width: "auto",
          }}
          top={true}
          src={imageUrl}/>
      </Col>
      <Col className="center" ms="3">
        <h6>{name}</h6>
      </Col>
      <Col className="center" ms="3">
        <h6>{linkedText}</h6>
      </Col>
      <Col className="center" ms="2">
        <h6>{chaosValue} Chaos</h6>
      </Col>
      <Col className="center" ms="2">
        <h6>{exaltedValue} Exalteds</h6>
      </Col>
    </Row>
  );
}

export default SearchResultList;
