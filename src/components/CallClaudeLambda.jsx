import React, { useEffect, useState } from "react";
import "../stylesheet/CallClaude.css";

const CallClaudeLambda = ({ myIdToken }) => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const invokeLambda = async () => {
    const url =
      "https://jj247o7l14.execute-api.us-east-1.amazonaws.com/hackathonStage/claude3-test"; // API Gatewayのエンドポイント
    const idToken = myIdToken; // Cognitoから取得したIDトークン

    setIsLoading(true);

    const headers = {
      "Content-Type": "application/json",
      Authorization: idToken,
    };
    const data = {
      prompt: prompt,
    };

    try {
      console.log("Sending request to API Gateway");
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      });
      console.log("Response received:", response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      console.log("Response Text:", responseText);
      const responseJson = JSON.parse(responseText);
      const responseMessage = JSON.parse(responseJson.body);
      console.log("Response JSON:", responseMessage);
      setResponse(responseMessage.message);
      // console.log("Response JSON:", responseJson["body"]);
    } catch (error) {
      console.error("Error during request:", error);
      setError("リクエストの送信中にエラーが発生しました: " + error.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    console.log("isLoading:", isLoading);
  }, [isLoading]);

  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "20px" }}>
      <input
        className="input-form"
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt here"
      />
      <div className="button-container">
        <button
          className={`input-button  ${isLoading ? "loadingButton" : ""}`}
          onClick={invokeLambda}
        >
          Call Lambda Function
        </button>
        <div className={isLoading ? "loading" : ""}></div>
      </div>
      <div className="content-container">
        {response && <div>Response: {response}</div>}
        {error && <div>Error: {error}</div>}
      </div>
    </div>
  );
};

export default CallClaudeLambda;
