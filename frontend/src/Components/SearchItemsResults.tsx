import * as React from "react";
import { Container, Row, Col, CardImg } from "reactstrap";
import { SearchItemsResultsProps, SearchResultsState, PoeNinjaItem } from "../Interfaces";

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
    })
  }

  public shouldComponentUpdate(nextProps, nextState) {
    return nextProps.poeItems !== this.state.poeItems
  }

  public render() {
    return (
      <Container style={{paddingTop: "20px"}}>
        <div>
          {
            this.state.poeItems.map((item) => <PoeNinjaItem key={item.name} item={item}/>)
          }
        </div>
      </Container>
    );
  }
}

const DEFAULT_IMG = "https://vignette.wikia.nocookie.net/pineapplepedia/images/3/3c/No-images-placeholder.png";

function PoeNinjaItem({ item }: { item: PoeNinjaItem }) {
  const imageUrl = item.imageUrl || DEFAULT_IMG;
  return (
    <Row>
      <Col md="2" xs="4">
        <CardImg
          top={true}
          width="100%"
          src={imageUrl}/>
      </Col>
      <Col>
        <h3>{item.name}</h3>
        {item.baseType ? <h6>Base Type: {item.baseType}</h6> : null}
        {item.itemType !== "Unknown"? <h6>Item Type: {item.itemType}</h6> : null}
        {item.levelRequired ? <h6>Required Level: {item.levelRequired}</h6> : null}
        {item.implicit ? <h6>{item.implicit}</h6> : null}
        {item.explicit ? item.explicit.map((mod) => <h6 key={name+mod}>{mod}</h6>) : null}
      </Col>
    </Row>
  );
}

export default SearchItemsResults;
