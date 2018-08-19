import * as React from "react";
import {
  Input,
  InputGroup,
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
          <Input type="text"
            style={{
              background: "#707070",
              color: "#E5DFC5",
            }}
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
    searchKey: state.search.search,
  };
}

export default connect(mapStateToProps)(SearchForm);
