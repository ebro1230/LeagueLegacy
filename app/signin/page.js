"use client";

export default function SignInPage() {
  async function handleSignIn() {
    console.log("Sign In Button Clicked");
    try {
      const response = await fetch(`http://localhost:8000/api/yahooAuth/auth`);
      const url = await response.json();
      window.location.href = await url;
    } finally {
    }
  }

  return <button onClick={handleSignIn}>Sign In</button>;
}
