import React from "react";
import { useState } from "react";
import "../stylesheet/Claude.css";
import ExecuteRequest from "./ExecuteRequest";

function Claude() {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const changeIsLoading = (isLoadingChild) => {
    if (isLoadingChild) setIsLoading(true);
    else setIsLoading(false);
  };

  const createRequest = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <div className="Claude">
        <h2>Claude Application</h2>
        <button
          onMouseDown={createRequest}
          id={isLoading ? "loading-button" : ""}
        >
          Send request
        </button>
        <ExecuteRequest count={count} changeIsLoading={changeIsLoading} />
      </div>
    </div>
  );
}

export default Claude;
