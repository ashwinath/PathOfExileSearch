import axios from "axios";
import * as React from "react";
import {
  Input,
  InputGroup,
  InputGroupAddon,
} from "reactstrap";
import {
  SearchState,
  SearchFormProps,
  SearchItemResult,
} from "../Interfaces";
import "./SearchForm.css"

class SearchForm extends React.Component<SearchFormProps, SearchState> {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
    }

    this.search = this.search.bind(this);
    this.onUserInputChange = this.onUserInputChange.bind(this);
  }

  public async search() {
    const { search } = this.state;
    try {
      const response = await axios.get<SearchItemResult>("/-/items/search", {
        params: {
          search,
        }
      });
      const result = response.data.data;
      this.props.onSearchFormChange(result);
    } catch (error) {
      this.props.onSearchFormChange([]);
    }
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
            value={this.state.search}/>
        </InputGroup>
      </div>
    );
  }

  private onUserInputChange(event) {
    const value = event.target.value;
    this.setState(() => {
      return {
        ...this.state,
        search: value,
      }
    }, this.search);
  }
}

export default SearchForm;
