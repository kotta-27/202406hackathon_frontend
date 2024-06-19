import React from "react";
import { useState } from "react";
import "../stylesheet/Claude.css";
import ExecuteRequest from "./ExecuteRequest";
import RadioButtonItems from "./RadioButtonItems";
import InputForm from "./InputForm";

const items = [
  { id: 1, item: "debug" },
  { id: 2, item: "throw" },
];

function Claude() {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [checkedValue, setCheckedValue] = useState(items[0].item);
  const [inputText, setInputText] = useState('');

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
    // ここで入力データを処理するための追加ロジックを実装できます
    // console.log("Received input:", inputText);
  };

  return (
    <div>
      <div className="Claude">
        <h2>Claude Application</h2>

        <InputForm onInputSubmit={handleInputSubmit} />
        {/* {inputText && <div>Input Text: {inputText}</div>} */}

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
          inputText={inputText}
        />
      </div>
    </div>
  );
}

export default Claude;
