import React, { useState } from 'react';

const CallClaudeLambda = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const invokeLambda = async () => {
    const url = 'https://jj247o7l14.execute-api.us-east-1.amazonaws.com/hackathonStage/claude3-test'; // API Gatewayのエンドポイント
    const idToken = 'eyJraWQiOiIyZW9hXC9WTW9KNjJEZFVWbWlZd09mUHhsQkp4WWxCTkZ1cnJYNjA5aEFkMD0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiWURpMUVOeFVtZ3lzcTVRUkJNNTFTZyIsInN1YiI6IjU0ODhiNDc4LTEwYzEtNzAxNC1iYzMzLTQ4MDIyOWM2MzUxZiIsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX0o4OTJlNkJyciIsImNvZ25pdG86dXNlcm5hbWUiOiJ0ZXN0Iiwib3JpZ2luX2p0aSI6IjAwM2VhYTY1LWI5MjItNGQxOS1iZmZjLWU5Yjc0YWMzZDE5NSIsImF1ZCI6IjV1NzZzNDVqb2pwMmdraDAyaTZvdTdkYXZmIiwiZXZlbnRfaWQiOiI0YmU4YzhhMy00YTQ3LTQ4M2UtYTIyNy1hMGI5ZTdlYzg5NGUiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTcxODg4NzAxMSwiZXhwIjoxNzE4ODkwNjExLCJpYXQiOjE3MTg4ODcwMTEsImp0aSI6ImRmYWU3OGEwLWUyMTEtNGEwYS04YjliLThhNTRlMTQxYmFlOCJ9.dWcGql1FkDFvktle4YGq07_msC4j7Myi2q1MJtBp8V-RhxyTRhCS0la08ElOVoRK0BEZcjJU9v37Hhqv-nVsl75FbmJXacinkrYkJ49bjMbP8dAJDSmvBwSMvcT7f9eBdjoDp-V8JA6gla4vKsf-LUsfJAtvOAI0uclLdEDL7dQ0UTwgUz09fG8Wwf1F54upRH_vZLwSOepx-QYsNwLt3Uj7DcQvTR3JssQTJCWWRIS7jKsxw0SXuX6EhZPeoOUb7uqVHs0IhD4ece_3ol0jCjkREUFjXrHKGPoimNcr1PzI3SdlsnMcAmMbNBCYEQSNhYOYxeFtLaagVMOTCzyFqg'; // Cognitoから取得したIDトークン

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': idToken
    };
    const data = {
      prompt: prompt,
    };

    try {
      console.log("Sending request to API Gateway");
      const response = await fetch(url, {
        method: 'POST',
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
      console.log("Response JSON:", responseJson);
      setResponse(responseJson.message);
    } catch (error) {
      console.error("Error during request:", error);
      setError("リクエストの送信中にエラーが発生しました: " + error.message);
    }
  };

  return (
    <div>
      <input 
        type="text" 
        value={prompt} 
        onChange={(e) => setPrompt(e.target.value)} 
        placeholder="Enter your prompt here" 
      />
      <button onClick={invokeLambda}>
        Call Lambda Function
      </button>
      {response && <div>Response: {response}</div>}
      {error && <div>Error: {error}</div>}
    </div>
  );
};

export default CallClaudeLambda;
