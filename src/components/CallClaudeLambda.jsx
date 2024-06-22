import React, { useEffect, useState } from "react";
import "../stylesheet/CallClaude.css";

const CallClaudeLambda = ({ myIdToken }) => {
  const [prompt, setPrompt] = useState("");
  const [threadNum, setThreadNum] = useState(10);
  const [response, setResponse] = useState(null);
  const [responseArray, setResponseArray] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSafe, setIsSafe] = useState(false);
  const [jsonURL, setJsonURL] = useState("");

  const invokeLambda = async () => {
    if (isSafe) var safeString = "safe-";
    else var safeString = "";
    const url =
      "https://jj247o7l14.execute-api.us-east-1.amazonaws.com/hackathonStage/claude3/" +
      safeString +
      "keijiban"; // API Gatewayのエンドポイント
    const idToken = myIdToken; // Cognitoから取得したIDトークン

    setIsLoading(true);

    const headers = {
      "Content-Type": "application/json",
      Authorization: idToken,
    };
    const data = {
      prompt: prompt,
      length: threadNum,
    };

    try {
      console.log("Sending request to API Gateway");
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      });
      // console.log("Response received:", response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      const responseJson = JSON.parse(responseText);
      const responseMessage = JSON.parse(responseJson.body);
      console.log("Response Message:", responseMessage);
      const responseJsonMessage = JSON.parse(responseMessage.message);
      console.log("Response Message:", responseJsonMessage);
      // console.log(typeof responseJsonMessage);

      const fileName = "thread";
      const fileNameWithJson = `${fileName}.json`;
      const blobData = new Blob([JSON.stringify(responseJsonMessage)], {
        type: "text/json",
      });
      const jsonURLTemp = URL.createObjectURL(blobData);
      setJsonURL(jsonURLTemp);

      setResponseArray(responseJsonMessage);
      // console.log(responseArray);
      setError(null);

      // console.log("Response JSON:", responseJson["body"]);
    } catch (error) {
      console.error("Error during request:", error);
      setError("リクエストの送信中にエラーが発生しました: " + error.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {}, [isLoading]);
  useEffect(() => {
    if (threadNum == 10) setIsSafe(true);
    else setIsSafe(false);
  }, [threadNum]);

  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "20px" }}>
      <input
        className="input-form"
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="キーワードを入力してください"
      />
      <div className="button-container">
        <button
          className={`input-button  ${isLoading ? "loadingButton" : ""}`}
          onClick={invokeLambda}
        >
          生成
        </button>
        <input
          className="thread-num-input"
          type="number"
          value={threadNum}
          onChange={(e) => setThreadNum(e.target.value)}
          placeholder="スレ数"
        />
        <div className={isLoading ? "loading" : ""}></div>
      </div>
      <div className="content-container">
        {responseArray.length > 0 && (
          <div>
            <h3 className="thread-title">{responseArray[0].title}</h3>
            <div className="thread-content">
              {responseArray.slice(1).map((res, index) => (
                <div key={index} className="post-container">
                  <p className="userinfo">
                    {res.index} 名前：
                    <span className="username">{res.name}</span>
                    {index != 0 && ":"} {res.time} {res.id}
                  </p>
                  <p className="content">{res.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {error && <div>Error: {error}</div>}
        <a href={jsonURL} download="thread.json">
          ふふh
        </a>
      </div>
    </div>
  );
};

export default CallClaudeLambda;
