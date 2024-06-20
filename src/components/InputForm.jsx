import React, { useState } from "react";
import "../stylesheet/InputForm.css";

const InputForm = ({ onInputSubmit }) => {
  const [inputText, setInputText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onInputSubmit(inputText);
    setInputText("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button type="MsgSet" class="MsgSetBtn">
          Message Set
        </button>
      </form>
    </div>
  );
};

export default InputForm;
