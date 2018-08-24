import * as React from "react";
import {
  Input,
  InputGroup,
  ButtonGroup,
  Button,
} from "reactstrap";
import {
  SearchFormProps,
} from "../Interfaces";
import { connect } from "react-redux";
import {
  search,
  searchServer,
  selectLinksRadioButton,
} from "../Actions";
import "./SearchForm.css"

class SearchForm extends React.Component<SearchFormProps, {}> {
  constructor(props) {
    super(props);
    this.onUserInputChange = this.onUserInputChange.bind(this);
    this.onRadioClick = this.onRadioClick.bind(this);
    this.getLinks = this.getLinks.bind(this);
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
          <ButtonGroup>
            <Button color="secondary"
              id="allLinksButtonStatus"
              onClick={this.onRadioClick}
              active={this.props.activeLinksButton === "allLinksButtonStatus"}>
              All
            </Button>
            <Button color="secondary"
              id="underFiveLinksButtonStatus"
              onClick={this.onRadioClick}
              active={this.props.activeLinksButton === "underFiveLinksButtonStatus"}>
              0-4 Linked
            </Button>
            <Button color="secondary"
              id="fiveLinksButtonStatus"
              onClick={this.onRadioClick}
              active={this.props.activeLinksButton === "fiveLinksButtonStatus"}>
              5 Linked
            </Button>
            <Button color="secondary"
              id="sixLinksButtonStatus"
              onClick={this.onRadioClick}
              active={this.props.activeLinksButton === "sixLinksButtonStatus"}>
              6 Linked
            </Button>
          </ButtonGroup>
        </InputGroup>
      </div>
    );
  }

  private onRadioClick(event) {
    const id = event.target.id;
    this.props.dispatch(selectLinksRadioButton(id));

    const links = this.getLinks(id);
    const value = this.props.searchKey;
    searchServer(value, links, this.props.dispatch);
  }

  private onUserInputChange(event) {
    const value = event.target.value;
    this.props.dispatch(search(value));
    // Very clumsy but works
    const links = this.getLinks(this.props.activeLinksButton);
    searchServer(value, links, this.props.dispatch);
  }

  private getLinks(activeLinksButton: string) {
    const mappings = {
      allLinksButtonStatus: [0,1,2,3,4,5,6,],
      underFiveLinksButtonStatus: [0,1,2,3,4,],
      fiveLinksButtonStatus: [5,],
      sixLinksButtonStatus: [6,],
    }
    return mappings[activeLinksButton];
  }
}

function mapStateToProps(state) {
  return {
    searchKey: state.search.search,
    activeLinksButton: state.search.activeLinksButton
  };
}

export default connect(mapStateToProps)(SearchForm);
