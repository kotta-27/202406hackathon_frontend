function GetToken() {
  // URLから認証コードを取得
  const urlParams = new URLSearchParams(window.location.search);
  const authCode = urlParams.get('code');

  // 認証コードを使ってトークンを取得
  async function getToken(authCode) {
      const clientId = '5u76s45jojp2gkh02i6ou7davf';  // CognitoのApp Client ID
      const redirectUri = 'http://localhost:3000';
      const userPoolDomain = 'omuraisu-test-userpool.auth.us-east-1.amazoncognito.com';  // CognitoのUser Pool Domain

      const response = await fetch(`https://${userPoolDomain}/oauth2/token`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
              'grant_type': 'authorization_code',
              'client_id': clientId,
              'redirect_uri': redirectUri,
              'code': authCode
          })
      });
      const tokens = await response.json();
      console.log(tokens);
      return tokens.id_token;
  }

  // トークンを取得して表示
    getToken(authCode).then(idToken => {
      console.log(idToken);
      //document.body.innerHTML = `<h1>Token received:</h1><pre>${idToken}</pre>`;
  }).catch(error => {
      console.error('Error:', error);
      //document.body.innerHTML = `<h1>Error occurred:</h1><pre>${error.message}</pre>`;
  });
  return (
    <div className="GetToken">
      <header className="GetToken-header"></header>
    </div>
  );
}

export default GetToken;
