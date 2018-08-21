import * as React from "react";
import GenericUnique from "./ItemCards/GenericUnique";
import DivinationCard from "./ItemCards/DivinationCard";
import { connect } from "react-redux";

interface DetailsProps {
  source: string | null;
}

function SearchResultDetails(props: DetailsProps) {
  switch(props.source) {
    case "DivinationCard":
      return (
        <DivinationCard />
      );
    default:
      return (
        <GenericUnique />
      );
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
