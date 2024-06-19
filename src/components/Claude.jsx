import React from "react";
import { useState } from "react";
import "../stylesheet/Claude.css";
import ExecuteRequest from "./ExecuteRequest";
import RadioButtonItems from "./RadioButtonItems";

const items = [
  { id: 1, item: "debug" },
  { id: 2, item: "throw" },
];

function Claude() {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [checkedValue, setCheckedValue] = useState(items[0].item);

  const changeIsLoading = (isLoadingChild) => {
    if (isLoadingChild) setIsLoading(true);
    else setIsLoading(false);
  };

  const createRequest = () => {
    setCount(count + 1);
  };

  const handleChange = (e) => {
    setCheckedValue(e.target.value);
  };

  return (
    <div>
      <div className="Claude">
        <h2>Claude Application</h2>
        <RadioButtonItems
          handleChange={handleChange}
          checkedValue={checkedValue}
          items={items}
        />
        <button
          onMouseDown={createRequest}
          id={isLoading ? "loading-button" : ""}
        >
          Send request
        </button>
        <ExecuteRequest
          count={count}
          changeIsLoading={changeIsLoading}
          checkedValue={checkedValue}
          items={items}
        />
      </div>
    </div>
  );
}

export default Claude;
