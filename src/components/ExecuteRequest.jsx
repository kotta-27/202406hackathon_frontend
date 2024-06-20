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
    あなたはなんJ民です．2Chのスレッドを立ててください．なお，エセ関西弁を用いて，とても煽り口調で書いてくだい
    形式は以下の通りです．以下の情報のJSON形式のリストで返してください:
    名前，時間，スレ内容．名前は，風吹けば名無しなど．なんJ民らしい名前をつけてください．
    必要におうじて安価をつけてください
    keyは英語に変換してください 例，名前 -> name
    リストは3要素にしてください．
    最初の要素は，title:"スレタイ”としてください．
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
      setMessage(responseText);
      setThreadJSON(thread);
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
            <p>
              {thread.name} : {thread.time}
            </p>
            <p>{thread.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExecuteRequest;
