import * as React from "react";
import { Container, Row, Col, CardImg } from "reactstrap";
import { SearchItemsResultsProps, SearchResultsState, PoeItem } from "../Interfaces";

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
            this.state.poeItems.map((item) => <PoeItem key={item.name} item={item}/>)
          }
        </div>
      </Container>
    );
  }
}

function PoeItem({ item }: { item: PoeItem }) {
  const poeNinja = item.poeNinja;
  let imageUrl = "https://d1u5p3l4wpay3k.cloudfront.net/pathofexile_gamepedia/c/cb/Einhar_Frey.png?version=341fd75b8f2079262d01ff4fee54c591";
  if (poeNinja) {
    imageUrl = poeNinja.imageUrl;
  }
  console.log(imageUrl)
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
        <h6>{item.baseItem}</h6>
        <h6>{item.className}</h6>
        {item.requiredLevel ? <h6>Required Level: {item.requiredLevel}</h6>: null}
        {item.requiredStrength ? <h6>Required Strength: {item.requiredStrength}</h6>: null}
        {item.requiredDexterity ? <h6>Required Dexterity: {item.requiredDexterity}</h6>: null}
        {item.requiredIntelligence ? <h6>Required Intelligence: {item.requiredIntelligence}</h6>: null}
        {item.mods.map((mod) => <h6 key={name+mod}>{mod}</h6>)}
      </Col>
    </Row>
  );
}

export default SearchItemsResults;
