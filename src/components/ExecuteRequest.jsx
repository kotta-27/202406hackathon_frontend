import React, { useEffect, useState } from "react";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import "../stylesheet/Execute.css";

const client = new BedrockRuntimeClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.REACT_APP_KEY_ID,
    secretAccessKey: process.env.REACT_APP_SECRET_KEY,
  },
});

function ExecuteRequest({ count, changeIsLoading, checkedValue, inputText }) {
  const [message, setMessage] = useState("");
  const [threadJSON, setThreadJSON] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const myPrompt = inputText;
  const systemPrompt = `
    あなたはなんJ民です.2Chのスレッドを立ててください．なお，エセ関西弁を用いて，とても煽り口調で書いてくだい
    返答は, json形式で返してください. 
    形式は以下の通りです
    [
      {"title": "スレのタイトル"},
        {
          "name": "名前",
          "time": "時間",
          "content": "スレの内容"
        },
        {
          "name": "名前",
          "time": "時間",
          "content": "スレの内容"
        },
        ...
    ]
    名前は，風吹けば名無しなど．なんJ民らしい名前をつけてください．
    「はい, わかりました」等の返答は不要です.スレのタイトルから，スレの内容までをJson形式で返してください．
    必要に応じて安価をつけてください
    keyは英語に変換してください 例，名前 -> name
  `;

  const params = {
    modelId: "anthropic.claude-3-haiku-20240307-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 10000,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: [{ type: "text", text: myPrompt }],
        },
      ],
    }),
  };

  const invokeModel = async () => {
    setIsLoading(true);
    try {
      const command = new InvokeModelCommand(params);
      const response = await client.send(command);
      const textDecoder = new TextDecoder("utf-8");
      const responseBodyText = textDecoder.decode(response.body);
      const responseBody = JSON.parse(responseBodyText);
      const responseText = responseBody.content[0].text;
      console.log("Response Text:", responseText);
        const thread = JSON.parse(responseText);
        setThreadJSON(thread);  // もし成功したら、スレッドの情報をセットする
        setMessage(responseText);  
        setThreadJSON(thread);


      // const thread = JSON.parse(responseText);
      // setMessage(responseText);
    } catch (error) {
      console.error("Error invoking model:", error);
      setMessage("Error invoking model");
      setThreadJSON([
        { name: "Error invoking model", time: "null", content: "null" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (checkedValue === "debug") {
      setMessage(`モデルを呼び出しました ${count}`);
      setThreadJSON([
        {
          name: `${count}`,
          time: "",
          content: "debug mode activated",
        },
      ]);
    } else if (checkedValue === "throw" && count > 0) {
      invokeModel();
      console.log(inputText);
    }
  }, [count]);

  useEffect(() => {
    changeIsLoading(isLoading);
  }, [isLoading, changeIsLoading]);

  return (
    <div className="text-container">
      <div className={isLoading ? "loading" : ""}></div>
      <h3>{myPrompt}</h3>
      <div className="Execute">
        {threadJSON.map((thread, index) => (
          <div key={index}>
            <p className="resInfo">
              {thread.name} : {thread.time}
            </p>
            <p className="resContent">{thread.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExecuteRequest;
