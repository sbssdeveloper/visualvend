
import React, { Suspense } from "react";

import ReactDOM from "react-dom/client";

const App = require("./Config/web/App.js").default;

if (process.env.REACT_APP_PLATFORM === "WEB") {
  const root = ReactDOM.createRoot(document.getElementById("root"));
  
  root.render(
    <Suspense fallback={"Loading...."}>
      <App />
    </Suspense>
  );
}
