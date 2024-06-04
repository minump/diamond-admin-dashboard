import NextAuth from 'next-auth';
import { OAuth2Config } from 'next-auth/providers';

// Define the custom provider for Globus
const GlobusProvider: OAuth2Config<any> = {
  id: "globus",
  name: "Globus",
  type: "oauth",

  authorization: {
    url: "https://auth.globus.org/v2/oauth2/authorize",
    params: {
      access_type: "offline",
      response_type: "code",

    }
  },
  // accessTokenUrl: "https://auth.globus.org/v2/oauth2/token",
  // requestTokenUrl: "https://auth.globus.org/v2/oauth2/auth",
  // authorizationUrl: "https://auth.globus.org/v2/oauth2/auth?response_type=code",
  // profileUrl: "https://auth.globus.org/v2/oauth2/userinfo",
  token: "https://auth.globus.org/v2/oauth2/token",
  userinfo: "https://auth.globus.org/v2/oauth2/userinfo",
  profile(profile) {
    return {
      id: profile.sub,
      name: profile.name,
      email: profile.email,
      image: profile.picture,
    };
  },
  clientId: process.env.GLOBUS_CLIENT_ID,
  clientSecret: process.env.GLOBUS_CLIENT_SECRET,
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  providers: [GlobusProvider],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true; // Additional sign-in logic can go here
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async session({ session, user, token }) {
      return session; // Additional session logic can go here
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      return token; // Additional JWT logic can go here
    }
  }
});