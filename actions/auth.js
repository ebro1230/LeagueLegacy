import { redirect } from "next/navigation";
let tokens;

export async function getTokensAndUserInfo(code) {
  const response = await fetch(
    `http://localhost:8000/api/yahooAuth/token-request`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
        client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
        redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
        code: code,
        grant_type: "authorization_code",
      }),
    }
  );
  tokens = await response.json();
  const userData = await getUserInfo(tokens);
  return { userData, tokens };
}

export async function retrieveTokens() {
  console.log("TOKENS");
  console.log(tokens);
  try {
    if (!tokens) {
      throw new Error("No Tokens");
    }
  } catch (e) {
    console.log(e);
    // redirect("/signin");
  }
  return tokens;
}

export async function getUserInfo(tokens) {
  const response = await fetch(
    `http://localhost:8000/api/yahooAuth/user-info`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessToken: tokens.access_token }),
    }
  );
  const data = await response.json();
  return data;
}
