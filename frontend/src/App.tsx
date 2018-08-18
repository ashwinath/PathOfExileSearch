import * as React from "react";
import SearchForm from "./Components/SearchForm";
import { PoeNinjaItem, MainState } from "./Interfaces";
import SearchItemsResults from "./Components/SearchItemsResults";
import NavigationBar from "./Components/NavigationBar";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

class App extends React.Component<{}, MainState> {
  constructor(props) {
    super(props);

    this.state = {
      poeItems: [],
    }

    this.onSearchFormChange = this.onSearchFormChange.bind(this);
  }

  public render() {
    return (
      <div>
        <NavigationBar/>
        <SearchForm onSearchFormChange={this.onSearchFormChange}/>
        <SearchItemsResults poeItems={this.state.poeItems}/>
      </div>
    );
  }

  private onSearchFormChange(poeItems: PoeNinjaItem[]) {
    this.setState(() => {
      return {
        ...this.state,
        poeItems,
      };
    });
  }
}

export default App;
