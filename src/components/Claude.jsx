import React from "react";
import { useState } from "react";
import "../stylesheet/Claude.css";
import ExecuteRequest from "./ExecuteRequest";

function Claude() {
  const [count, setCount] = useState(0);

  const createRequest = () => {
    setCount(count + 1);
  };

  return (
    <div className="Claude">
      <h2>Claude Application</h2>
      <button onMouseDown={createRequest}>Send to request</button>
      <ExecuteRequest count={count} />
    </div>
  );
}

export default Claude;
