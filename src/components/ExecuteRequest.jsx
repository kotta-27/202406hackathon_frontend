import React, { useEffect } from "react";
import { useState } from "react";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
// import "../stylesheet/Claude.css";

const client = new BedrockRuntimeClient({ region: "us-east-1" });

// モデルを呼び出す関数を実行
function ExecuteRequest({ count }) {
  const [message, setMessage] = useState("");

  // BedrockRuntimeClientのインスタンスを作成し、AWSのus-east-1リージョンを指定

  // モデルに渡すパラメータを設定
  const params = {
    modelId: "anthropic.claude-3-haiku-20240307-v1:0", // 使用するモデルのID
    contentType: "application/json", // リクエストのContent-Type
    accept: "application/json", // レスポンスのAcceptヘッダー
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31", // 使用するAnthropicのバージョン
      max_tokens: 1000, // 最大トークン数
      messages: [
        { role: "user", content: [{ type: "text", text: "お腹が空きました" }] },
      ], // ユーザーの入力メッセージ
    }),
  };

  // モデルを呼び出す非同期関数 async
  const invokeModel = async () => {
    try {
      // InvokeModelCommandのインスタンスを作成し、パラメータを渡す
      const command = new InvokeModelCommand(params);
      // BedrockRuntimeClientを使ってコマンドを送信し、レスポンスを取得
      const response = await client.send(command);
      // レスポンスボディをUTF-8文字列にデコードするためのTextDecoderを作成
      const textDecoder = new TextDecoder("utf-8");
      // レスポンスのボディをデコードしてテキストに変換
      const responseBodyText = textDecoder.decode(response.body);
      // テキストをJSONにパース -> jsonをjsのオブジェクトに変換
      const responseBody = JSON.parse(responseBodyText);
      // レスポンスの内容からテキストを抽出
      const responseText = responseBody.content[0].text;
      // レスポンステキストをコンソールに出力
      console.log("Response Text:", responseText);
      setMessage(responseText);
    } catch (error) {
      // エラーが発生した場合はエラーメッセージをコンソールに出力
      console.error("Error invoking model:", error);
      setMessage("Error invoking model");
    }
  };

  useEffect(() => {
    // invokeModel();
    setMessage(`モデルを呼び出しました${count}`);
  }, [count]);

  useEffect(() => {
    console.log(message);
  }, [message]);

  return <div className="Execute">{message}</div>;
}

export default ExecuteRequest;