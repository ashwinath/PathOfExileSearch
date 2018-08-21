import * as React from "react";
import GenericUnique from "./ItemCards/GenericUnique";
import Essence from "./ItemCards/Essence";
import DivinationCard from "./ItemCards/DivinationCard";
import Prophecy from "./ItemCards/Prophecy"
import Map from "./ItemCards/Map"
import { connect } from "react-redux";

interface DetailsProps {
  source: string | null;
}

function SearchResultDetails(props: DetailsProps) {
  switch(props.source) {
    case "DivinationCard":
      return (<DivinationCard />);
    case "Essence":
      return (<Essence />);
    case "Prophecy":
      return (<Prophecy />);
    case "Map":
      return (<Map />);
    default:
      return (<GenericUnique />);
  }
}

function mapStateToProps(state) {
  const clickedItem =  state.search.clickedItem;

  let source = null;
  if (clickedItem) {
    source = clickedItem.source;
  }

  return {
    source,
  };
}

export default connect(mapStateToProps)(SearchResultDetails);
