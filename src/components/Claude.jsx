import React from "react";
import { useState } from "react";
import "../stylesheet/Claude.css";
import CallClaudeLambda from "./CallClaudeLambda";
import RadioButtonItems from "./RadioButtonItems";
import InputForm from "./InputForm";
import GetToken from "./GetToken";

const items = [
  { id: 1, item: "debug" },
  { id: 2, item: "throw" },
];

function Claude({ myIdToken }) {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [checkedValue, setCheckedValue] = useState(items[0].item);
  const [inputText, setInputText] = useState("");

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

  const handleInputSubmit = (inputText) => {
    setInputText(inputText);
  };

  return (
    <div>
      <div className="Claude">
        {/* <InputForm onInputSubmit={handleInputSubmit} /> */}
        <RadioButtonItems
          handleChange={handleChange}
          checkedValue={checkedValue}
          items={items}
          className="RadioButtonItems"
        />
        <h2>なんJnerator</h2>
        <CallClaudeLambda myIdToken={myIdToken} />
      </div>
    </div>
  );
}

export default Claude;
