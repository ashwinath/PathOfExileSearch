import axios from "axios";
import * as Autocomplete from "react-autocomplete";
import * as React from "react";
import {
  Container,
  Label,
  Input,
} from "reactstrap";
import {
  SearchState,
  FormData,
  SearchFormProps,
  SearchItemResult,
} from "../Interfaces";
import "./SearchForm.css"

class SearchForm extends React.Component<SearchFormProps, SearchState> {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        classNames: [],
        baseItems: [],
      },
      selectedClassName: "",
      userInput: {
        name: "",
        className: "",
        baseItem: "",
        mods: "",
        requiredLevel: "",
      }
    }

    this.search = this.search.bind(this);
  }

  public async search() {
    try {
      const postBody = {
        ...this.state.userInput,
        requiredLevel: parseInt(this.state.userInput.requiredLevel, 10),
      }
      const response = await axios.post<SearchItemResult>("/-/items/search", postBody);
      const result = response.data.data;
      this.props.onSearchFormChange(result);
    } catch (error) {
      this.props.onSearchFormChange([]);
    }
  }

  public async componentDidMount() {
    const response = await axios.get<FormData>("/-/form");
    this.setState(() => {
      return {
        data: response.data
      }
    });
  }

  public render() {
    if (this.state.data) {
      return (
        <Container>
          <h1>Path Of Exile Search</h1>
          <div>
            <Label className="form-label-search">Base Class</Label>
            <Autocomplete
              inputProps={{ placeholder: "Class" }}
              shouldItemRender={this.shouldItemRender}
              getItemValue={this.getItemValue}
              items={this.state.data.classNames}
              renderItem={this.renderItem}
              value={this.state.userInput.className}
              onChange={this.onUserInputChange.bind(this, "className")}
              onSelect={this.onAutoCompleteSelect.bind(this, "className")}
            />
          </div>
          <div>
            <Label className="form-label-search">Base Item</Label>
            <Autocomplete
              inputProps={{ placeholder: "Base Item" }}
              shouldItemRender={this.shouldItemRender}
              getItemValue={this.getItemValue}
              items={this.state.data.baseItems}
              renderItem={this.renderItem}
              value={this.state.userInput.baseItem}
              onChange={this.onUserInputChange.bind(this, "baseItem")}
              onSelect={this.onAutoCompleteSelect.bind(this, "baseItem")}
            />
          </div>

          <div>
            <Label className="form-label-search">Name</Label>
            <Input type="text"
              name="search-name"
              id="search-name"
              onChange={this.onUserInputChange.bind(this, "name")}
              value={this.state.userInput.name}/>
          </div>

          <div>
            <Label className="form-label-search">Mods</Label>
            <Input type="text"
              name="search-mods"
              id="search-mods"
              onChange={this.onUserInputChange.bind(this, "mods")}
              value={this.state.userInput.mods}/>
          </div>
        </Container>
      );
    } else {
      return (
        <Container>
          <h1>Loading</h1>
        </Container>
      );
    }
  }

  private onUserInputChange(field, event) {
    const value = event.target.value;
    this.setState(() => {
      const newState = {
        ...this.state,
      };
      newState.userInput[field] = value;
      return newState;
    }, this.search);
  }

  private shouldItemRender(item, value) {
    return item.toLowerCase().indexOf(value.toLowerCase()) > -1
  }

  private getItemValue(item) {
    return item;
  }

  private renderItem(item, isHighlighted) {
    return (
      <div key={item} style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
        {item}
      </div>
    );
  }

  private onAutoCompleteSelect(field, value) {
    this.setState(() => {
      const newState = {
        ...this.state,
        selectedClassName: value,
      }
      newState.userInput[field] = value;

      return newState;
    }, this.search)

  }
}

export default SearchForm;
