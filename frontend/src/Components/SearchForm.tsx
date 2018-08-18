import * as React from "react";
import {
  Input,
  InputGroup,
  InputGroupAddon,
} from "reactstrap";
import {
  SearchFormProps,
} from "../Interfaces";
import { connect } from "react-redux";
import { search, searchServer } from "../Actions";
import "./SearchForm.css"

class SearchForm extends React.Component<SearchFormProps, {}> {
  constructor(props) {
    super(props);
    this.onUserInputChange = this.onUserInputChange.bind(this);
  }

  public render() {
    return (
      <div>
        <InputGroup size="lg">
          <InputGroupAddon addonType="prepend">Search anything</InputGroupAddon>
          <Input type="text"
            name="search-mods"
            id="search-mods"
            placeholder="Search names, mods, item types, flavour texts..."
            onChange={this.onUserInputChange}
            value={this.props.searchKey}/>
        </InputGroup>
      </div>
    );
  }

  private onUserInputChange(event) {
    const value = event.target.value;
    this.props.dispatch(search(value));
    // Very clumsy but works
    searchServer(value, this.props.dispatch);
  }
}

function mapStateToProps(state) {
  return {
    searchKey: state.searchKey,
  };
}

export default connect(mapStateToProps)(SearchForm);
