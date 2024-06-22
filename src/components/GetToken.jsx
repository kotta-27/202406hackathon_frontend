import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "../stylesheet/GetToken.css";

function GetToken({ handleToken }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");

    if (authCode && !isAuthorized) {
      getToken(authCode)
        .then((responsedIdTokenData) => {
          const responsedIdToken = String(responsedIdTokenData);
          handleToken(responsedIdToken);
          setIsAuthorized(true);

          // デコードしてユーザー名を取得
          const decodedToken = jwtDecode(responsedIdToken);
          const userName = String(decodedToken["cognito:username"]); // ユーザー名のクレームを確認する
          setUserName(userName);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [isAuthorized, handleToken]);

  const getToken = async (authCode) => {
    const clientId = "f3om54e8nkgfkp3duo56rolhe"; // CognitoのApp Client ID
    const redirectUri = "http://localhost:3000";
    const userPoolDomain =
      "202406hackathonkaba.auth.us-west-2.amazoncognito.com"; // CognitoのUser Pool Domain

    const response = await fetch(`https://${userPoolDomain}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        redirect_uri: redirectUri,
        code: authCode,
      }),
    });
    const tokens = await response.json();
    return tokens.id_token;
  };

  return (
    <div className="GetToken">
      <header className="GetToken-header">
        {isAuthorized && userName != "" ? (
          <div>
            <p>Welcome, {userName}!</p>
          </div>
        ) : (
          <p>
            !NOT AUTHORIZED!
            <a
              className="login-link"
              href="https://202406hackathonkaba.auth.us-west-2.amazoncognito.com/oauth2/authorize?client_id=f3om54e8nkgfkp3duo56rolhe&response_type=code&scope=email+openid+phone&redirect_uri=http%3A%2F%2Flocalhost%3A3000"
            >
              Please Login Again
            </a>
          </p>
        )}
      </header>
    </div>
  );
}

export default GetToken;
