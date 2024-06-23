import React, { useEffect, useState } from "react";
import "../stylesheet/CallClaude.css";

const CallClaudeLambda = ({ myIdToken }) => {
  const [prompt, setPrompt] = useState("");
  const [threadNum, setThreadNum] = useState(10);
  const [responseArray, setResponseArray] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [jsonURL, setJsonURL] = useState("");
  const [crazyLevel, setCrazyLevel] = useState(1);
  const [imageUrl, setImageUrl] = useState("");

  const invokeTextLambda = async () => {
    const url =
      "https://k0btfvyqx5.execute-api.us-west-2.amazonaws.com/2024hackathon/claude3/keijiban";
    const idToken = myIdToken;

    setIsLoading(true);

    const headers = {
      "Content-Type": "application/json",
      Authorization: idToken,
    };
    const data = {
      prompt: prompt,
      length: threadNum,
      level: crazyLevel,
    };

    try {
      console.log("Sending request to API Gateway");
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      const responseJson = JSON.parse(responseText);
      const responseMessage = JSON.parse(responseJson.body);
      console.log("Response Message:", responseMessage);
      const styledMessage = responseMessage.message.substring(responseMessage.message.indexOf("[",));
      const responseJsonMessage = JSON.parse(styledMessage);
      console.log("Response Message:", responseJsonMessage);

      const fileName = "thread";
      const fileNameWithJson = `${fileName}.json`;
      const blobData = new Blob([JSON.stringify(responseJsonMessage)], {
        type: "text/json",
      });
      const jsonURLTemp = URL.createObjectURL(blobData);
      setJsonURL(jsonURLTemp);

      setResponseArray(responseJsonMessage);
      setError(null);
    } catch (error) {
      console.error("Error during request:", error);
      setError("リクエストの送信中にエラーが発生しました: " + error.message);
    }
    setIsLoading(false);
  };

  const fetchImageFromBedrock = async () => {
    var seed = Math.floor(Math.random() * 10000);
    console.log("image Seed:", seed);
    const data = {
      style_preset: "photographic",
      text_prompts: [
        {
          text: `
                you are a famous advertising agency designer.  
                please generate ultimate hight quality real 
                photographic advertising on the internet.
                for example, game, application, and so on.
                or the image of ${prompt}.
                `,
          weight: 0.8,
        },
      ],
      model_id: "stability.stable-diffusion-xl-v1",
      cfg_scale: 10,
      seed: seed,
      steps: 100,
      width: 512,
      height: 512,
    };

    const myHeaders = {
      "Content-Type": "application/json",
      Authorization: myIdToken,
    };
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(data),
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://k0btfvyqx5.execute-api.us-west-2.amazonaws.com/2024hackathon/adimage",
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Image result:", result);

      const resBody = JSON.parse(result.body);
      const binaryData = resBody.image;
      setImageUrl("data:image/png;base64," + binaryData);
    } catch (error) {
      console.error("Error fetching image:", error);
      setError("画像の取得中にエラーが発生しました: " + error.message);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    await invokeTextLambda();
    await fetchImageFromBedrock();
    setIsLoading(false);
  };

  useEffect(() => {}, [isLoading]);

  const changeCrazyLevel = (e) => {
    setCrazyLevel(e.target.value);
  };

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
          onClick={handleGenerate}
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
        <input
          className="thread-gauge"
          type="range"
          min="1"
          max="5"
          step="1"
          value={crazyLevel}
          onChange={changeCrazyLevel}
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
                    {index !== 0 && ":"} {res.time} {res.id}
                  </p>
                  <p className="content">{res.content}</p>
                  {index > 1 && index % 5 === 0 && imageUrl && (
                    <div className="image-container">
                      <img
                        className="my-image"
                        src={imageUrl}
                        alt="Generated"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {error && <div>Error: {error}</div>}
        <p>{crazyLevel}</p>
      </div>
    </div>
  );
};

export default CallClaudeLambda;
