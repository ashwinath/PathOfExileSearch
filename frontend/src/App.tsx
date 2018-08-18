import * as React from "react";
import SearchForm from "./Components/SearchForm";
import SearchItemsResults from "./Components/SearchItemsResults";
import NavigationBar from "./Components/NavigationBar";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

class App extends React.Component {
  public render() {
    return (
      <div>
        <NavigationBar/>
        <SearchForm/>
        <SearchItemsResults/>
      </div>
    );
  }
}

export default connect()(App);
