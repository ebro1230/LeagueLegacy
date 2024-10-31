"use server";

import { cookies } from "next/headers";

export async function createCookie(tokens) {
  cookies().set("accessToken", tokens.access_token, {
    maxAge: 3600,
    sameSite: "none",
    secure: true,
  });
  cookies().set("refreshToken", tokens.refresh_token, {
    maxAge: 3600,
    sameSite: "none",
    secure: true,
  });
}

export async function getCookie() {
  return new Promise((resolve, reject) => {
    const accessToken = cookies().get("accessToken");
    const refreshToken = cookies().get("refreshToken");
    resolve({
      accessToken: accessToken.value,
      refreshToken: refreshToken.value,
    });
  });
}
