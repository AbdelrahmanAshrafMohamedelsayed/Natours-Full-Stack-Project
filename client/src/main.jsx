import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import store from "./Store/store.js";
import { Provider } from "react-redux";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SkeletonTheme baseColor="#eee" highlightColor="#dadada">
      <Provider store={store}>
        <App />
      </Provider>
    </SkeletonTheme>
  </React.StrictMode>
);
