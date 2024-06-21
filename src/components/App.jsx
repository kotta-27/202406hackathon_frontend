import React, { useState } from "react";
import "../stylesheet/App.css";
import Claude from "./Claude";
import GetToken from "./GetToken";

function App() {
  const [myIdToken, setMyIdToken] = useState("");

  const handleToken = (idToken) => {
    setMyIdToken(idToken);
  };

  return (
    <div className="App">
      <GetToken myIdToken={myIdToken} handleToken={handleToken} />
      <Claude myIdToken={myIdToken} />
    </div>
  );
}

export default App;
