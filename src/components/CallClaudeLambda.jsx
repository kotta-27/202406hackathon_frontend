import React, { useEffect, useState } from "react";
import RadioButtonItems from "./RadioButtonItems";
import "../stylesheet/CallClaude.css";

const CallClaudeLambda = ({ myIdToken, myUserName }) => {
  const [prompt, setPrompt] = useState("");
  const [threadNum, setThreadNum] = useState(10);
  const [responseArray, setResponseArray] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [jsonURL, setJsonURL] = useState("");
  const [crazyLevel, setCrazyLevel] = useState(1);
  const [imageUrl, setImageUrl] = useState("");
  const [replyPrompt, setReplyPrompt] = useState("");

  const [replyArray, setReplyArray] = useState([]);
  const [isReplyExist, setIsReplyExist] = useState(false);

  const items = [
    { id: 0, item: "nanj" },
    { id: 1, item: "otaku" },
    { id: 2, item: "dk" },
    { id: 3, item: "ojo" },
    { id: 4, item: "mtg" },
    // { id: 5, item: "mouko" },
    { id: 6, item: "safe" },
  ];

  const [checkedValue, setCheckedValue] = useState(items[0].item);
  const [checkedId, setCheckedId] = useState(items[0].id);
  console.log("checkedId:", checkedId);

  const invokeTextLambda = async () => {
    setReplyArray([]);
    const url =
      "https://k0btfvyqx5.execute-api.us-west-2.amazonaws.com/2024hackathon/claude3/keijiban-" +
      String(checkedId);
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
      console.log("num:", threadNum);
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
      const styledMessage = responseMessage.message.substring(
        responseMessage.message.indexOf("[")
      );
      const responseJsonMessage = JSON.parse(styledMessage);

      const fileName = "thread";
      const fileNameWithJson = `${fileName}.json`;
      const blobData = new Blob([JSON.stringify(responseJsonMessage)], {
        type: "text/json",
      });
      const jsonURLTemp = URL.createObjectURL(blobData);
      setJsonURL(jsonURLTemp);

      setResponseArray(responseJsonMessage);
      console.log("Response:", responseJsonMessage);
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
                please generate ultimate high quality real 
                photographic advertising on the internet.
                for example, game, application, and so on.
                or the image of ${prompt}.
                `,
          weight: 1.0,
        },
      ],
      cfg_scale: 10,
      seed: seed,
      steps: 50,
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

  const invokeReplyTextLambda = async (event) => {
    event.preventDefault();

    const url =
      "https://k0btfvyqx5.execute-api.us-west-2.amazonaws.com/2024hackathon/claude3/reply";
    const idToken = myIdToken;

    const headers = {
      "Content-Type": "application/json",
      Authorization: idToken,
    };
    const data = {
      pre_thread: responseArray,
      reply: replyPrompt,
      length: parseInt(threadNum) + 1,
      level: crazyLevel,
    };

    console.log("ReplyThreadNum:", threadNum + 1);

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
      const styledMessage = responseMessage.message.substring(
        responseMessage.message.indexOf("[")
      );
      const responseJsonMessage = JSON.parse(styledMessage);

      const fileName = "thread";
      const fileNameWithJson = `${fileName}.json`;
      const blobData = new Blob([JSON.stringify(responseJsonMessage)], {
        type: "text/json",
      });
      const jsonURLTemp = URL.createObjectURL(blobData);
      setJsonURL(jsonURLTemp);

      setReplyArray(responseJsonMessage);
      setIsReplyExist(true);

      console.log("ReplyResponse:", replyArray);
      setError(null);
    } catch (error) {
      console.error("Error during request:", error);
      setError("リクエストの送信中にエラーが発生しました: " + error.message);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    await invokeTextLambda();
    await fetchImageFromBedrock();
    setIsLoading(false);
  };

  const handleChange = (e) => {
    const selectedValue = e.target.value;
    setCheckedValue(selectedValue);
    const selectedItem = items.find((item) => item.item === selectedValue);
    if (selectedItem) {
      setCheckedId(selectedItem.id);
    }
  };
  useEffect(() => {}, [isLoading]);

  const changeCrazyLevel = (e) => {
    setCrazyLevel(e.target.value);
  };

  useEffect(() => {}, [replyArray]);

  const deleteReplyForm = () => {
    setReplyPrompt("");
    setIsReplyExist(false);
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
        {/* <br></br> */}
        レス数
        <input
          className="thread-num-input"
          type="number"
          value={threadNum}
          onChange={(e) => setThreadNum(e.target.value)}
          placeholder="スレ数"
        />
        危険度
        <input
          className="thread-gauge"
          type="range"
          min="1"
          max="5"
          step="1"
          value={crazyLevel}
          onChange={changeCrazyLevel}
        />
        <RadioButtonItems
          handleChange={handleChange}
          checkedValue={checkedValue}
          items={items}
        />
        <button
          className={`input-button  ${isLoading ? "loadingButton" : ""}`}
          onClick={handleGenerate}
        >
          生成
        </button>
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
        {responseArray.length > 0 && (
          <form onSubmit={invokeReplyTextLambda}>
            <input
              className={`response-form ${isReplyExist ? "reply-exist" : ""}`}
              type="text"
              placeholder="返信を入力"
              onChange={(e) => setReplyPrompt(e.target.value)}
            />
            <button
              className={`response-submit ${isReplyExist ? "reply-exist" : ""}`}
              type="submit"
              // onClick={deleteReplyForm}
            >
              送信
            </button>
          </form>
        )}
        {replyArray.length > 0 && (
          <div className="post-container">
            <p className="userinfo">
              {parseInt(threadNum) + 1} 名前：
              <span className="username">{myUserName}</span>
              {": "}
              {responseArray[responseArray.length - 1].time} @YOU
            </p>
            <p className="content">{replyPrompt}</p>
          </div>
        )}
        {replyArray.length > 0 && (
          <div>
            <div className="thread-content">
              {replyArray.slice(1).map((res, index) => (
                <div key={index} className="post-container">
                  <p className="userinfo">
                    {res.index} 名前：
                    <span className="username">{res.name}</span>
                    {index !== 0 && ":"} {res.time} {res.id}
                  </p>
                  <p className="content">{res.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {error && <div>Error: {error}</div>}
        {/* <p>{crazyLevel}</p> */}
        {/* <a href={jsonURL}>aa</a> */}
      </div>
    </div>
  );
};

export default CallClaudeLambda;
