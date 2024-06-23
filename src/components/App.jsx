import React, { useState } from "react";
import "../stylesheet/App.css";
import Claude from "./Claude";
import GetToken from "./GetToken";

function App() {
  const [myIdToken, setMyIdToken] = useState("");
  const [myUserName, setMyUserName] = useState("kota");

  const handleToken = (idToken) => {
    setMyIdToken(idToken);
  };

  const handleUserName = (userName) => {
    setMyUserName(userName);
  };

  return (
    <div className="App">
      <GetToken
        myIdToken={myIdToken}
        myUserName={myUserName}
        handleToken={handleToken}
        handleUserName={handleUserName}
      />
      <Claude myIdToken={myIdToken} myUserName={myUserName} />
    </div>
  );
}

export default App;
