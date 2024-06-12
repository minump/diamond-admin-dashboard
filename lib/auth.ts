import { NextApiHandler } from 'next';
import NextAuth, { NextAuthConfig, User } from 'next-auth';
import { OAuth2Config } from 'next-auth/providers';

const callbackUrl = `${process.env.VERCEL_URL}/api/auth/callback/globus`;
console.log('callbackUrl: ', callbackUrl);
// Define the custom provider for Globus
const GlobusProvider: OAuth2Config<any> = {
  id: "globus",
  name: "Globus",
  type: "oauth",
  redirectProxyUrl: callbackUrl,
  authorization: {
    url: "https://auth.globus.org/v2/oauth2/authorize",
    params: {
      scope: "openid profile email",
      access_type: "offline",
      response_type: "code",
      urn: "globus:auth:scope:transfer.api.globus.org:all"
    },

  },
  // accessTokenUrl: "https://auth.globus.org/v2/oauth2/token",
  // requestTokenUrl: "https://auth.globus.org/v2/oauth2/auth",
  // authorizationUrl: "https://auth.globus.org/v2/oauth2/auth?response_type=code",
  // profileUrl: "https://auth.globus.org/v2/oauth2/userinfo",
  token: {
    async request(context: { code: string }) {
      try {
        const response = await fetch("https://auth.globus.org/v2/oauth2/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            // client_id: process.env.DIAMOND_CLIENT_ID as string,
            // client_secret: process.env.DIAMOND_CLIENT_SECRET as string,
            code: context.code,
            grant_type: "authorization_code",
            redirect_uri: callbackUrl,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error requesting token:', error);
        return null;
      }
    }
  },
  userinfo: {
    async request(context: { token: string }) {
      try {
        const response = await fetch("https://auth.globus.org/v2/oauth2/userinfo", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${context.token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching user info:', error);
        return null;
      }
    }
  },
  profile(profile) {
    return {
      id: profile.sub,
      name: profile.name,
      email: profile.email,
      image: profile.picture,
    };
  },
  clientId: process.env.DIAMOND_CLIENT_ID,
  clientSecret: process.env.DIAMOND_CLIENT_SECRET,
};

export const authOptions: NextAuthConfig = {
  providers: [GlobusProvider],
  callbacks: {
    async jwt(context) {
      // console.log('jwt context', context);
      const { token, user, account, profile } = context;

      if (user) {
        // user.account = account;
        token.user = user;
      }
      return token;
    },
    async session(context) {
      // console.log('session context', context);
      const { session, user, token } = context;

      session.user = user;
      return session;
    },
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 60 * 60, // 1h
  },
};

export const { auth, handlers, signIn, signOut } = NextAuth(authOptions);

