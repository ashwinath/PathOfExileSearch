import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { createStore, applyMiddleware } from "redux";
import logger from "redux-logger";
import { Provider } from "react-redux";
import reducer from "./Reducers";
import "./index.css";

const middleware: any = [];

if (process.env.NODE_ENV !== "production") {
  middleware.push(logger)
}

const store = createStore(
  reducer,
  applyMiddleware(...middleware),
)

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById("root") as HTMLElement
);
