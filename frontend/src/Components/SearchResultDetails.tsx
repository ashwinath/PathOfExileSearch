import * as React from "react";
import { SearchResultDetailsProps, SearchResultDetailsState } from "../Interfaces";

class SearchResultDetails extends React.Component<SearchResultDetailsProps, SearchResultDetailsState> {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.item,
    };
  }

  public render() {
    const { item } = this.state;
    if (!item) {
      return (
        <h1>Not implemented yet</h1>
      );
    }
    return (
      <h1>{item.id}</h1>
    );
  }
}

export default SearchResultDetails;
