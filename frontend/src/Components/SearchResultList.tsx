import * as React from "react";
import { SearchResultListProps, SearchResultListItem } from "../Interfaces";
import { Row, Col, CardImg } from "reactstrap";
import { mapSourceToName } from "../Utils/Mappings";
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

function SearchResultItem(props: SearchResultListItem) {
  const {
    name,
    imageUrl,
    price,
    baseType,
    source,
  } = props;
  const size = "90px";

  const baseItem = baseType ? baseType : mapSourceToName(source);

  return (
    <Row className="d-flex align-items-center item-container">
      <Col className="center" ms="3">
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
        <h6>{baseItem}</h6>
      </Col>
      <Col className="center" ms="3">
        <h6>{price} Chaos</h6>
      </Col>
    </Row>
  );
}

export default SearchResultList;
