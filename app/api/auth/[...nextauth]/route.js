// /pages/api/auth/[...nextauth].js

import NextAuth from "next-auth";

const handler = NextAuth({
  providers: [
    {
      id: "yahoo",
      name: "Yahoo",
      type: "oauth",
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      wellKnown: "https://api.login.yahoo.com/.well-known/openid-configuration",
      authorization: {
        url: "https://api.login.yahoo.com/oauth2/request_auth",
        params: {
          client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
          client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
          redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
          response_type: "code",
          scope: "openid profile email fspt-r",
        },
      },
      token: "https://api.login.yahoo.com/oauth2/get_token",
      userinfo: "https://api.login.yahoo.com/openid/v1/userinfo",
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
      //idToken: true,
      client: {
        authorization_signed_response_alg: "ES256",
        id_token_signed_response_alg: "ES256",
      },
      //checks: ["state"],
    },
    // Add more providers here
  ],
  // Optional: Customize callbacks or events here
  callbacks: {
    // jwt callback to capture the access token from Yahoo
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = Date.now() + 3600 * 1000; // 1 hour
        token.id = profile.id;
      }
      return token;
    },

    // session callback to expose the access token to the client
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.user.id = token.id;
      session.expires = token.accessTokenExpires;

      return session;
    },
  },
  session: {
    strategy: "jwt", // Ensure session uses JWT strategy
  },
});

export { handler as GET, handler as POST };
