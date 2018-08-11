import * as React from "react";
import SearchForm from "./Components/SearchForm";
import { PoeItem } from "./Interfaces";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

class App extends React.Component {
  public onSearchFormChange(poeItems: PoeItem[]) {
    // TODO: implement this
    console.log(JSON.stringify(poeItems));
  }

  public render() {
    return (
      <SearchForm onSearchFormChange={this.onSearchFormChange}/>
    );
  }
}

export default App;
