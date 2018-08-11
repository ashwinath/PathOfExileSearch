import axios from "axios";
import * as Autocomplete from "react-autocomplete";
import * as React from "react";
import {
  Container,
  Label,
  Input,
} from "reactstrap";
import "./SearchForm.css"

interface SearchState {
  data: FormData
  selectedClassName: string;
  userInput: UserInput;
}

interface UserInput {
  className: string;
  baseItem: string;
  implicitStatText: string;
  explicitStatText: string;
  requiredLevel: string;
}

interface FormData {
  classNames: string[];
  baseItems: string[];
}

class SearchForm extends React.Component<{}, SearchState> {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        classNames: [],
        baseItems: [],
      },
      selectedClassName: "",
      userInput: {
        className: "",
        baseItem: "",
        implicitStatText: "",
        explicitStatText: "",
        requiredLevel: "",
      }
    }

    this.search = this.search.bind(this);
  }

  public async search() {
    console.log("still searching...")
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
            <Label className="form-label-search">Required Level</Label>
            <Input type="text"
              name="search-level"
              id="search-level"
              onChange={this.onUserInputChange.bind(this, "requiredLevel")}
              value={this.state.userInput.requiredLevel}/>
          </div>

          <div>
            <Label className="form-label-search">Implicit Mod</Label>
            <Input type="text"
              name="search-level"
              id="search-level"
              onChange={this.onUserInputChange.bind(this, "implicitStatText")}
              value={this.state.userInput.implicitStatText}/>
          </div>

          <div>
            <Label className="form-label-search">Explicit Mod</Label>
            <Input type="text"
              name="search-level"
              id="search-level"
              onChange={this.onUserInputChange.bind(this, "explicitStatText")}
              value={this.state.userInput.explicitStatText}/>
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
