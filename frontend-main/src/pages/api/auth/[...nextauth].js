import NextAuth from "next-auth";

export const authOptions = {
  providers: [],
  logger: {
    error(code, metadata) {
      if (code !== 'CLIENT_FETCH_ERROR') {
        console.error(code, metadata);
      }
    },
    warn(code) {
      if (code !== 'NEXTAUTH_URL') {
        console.warn(code);
      }
    },
  },
  callbacks: {
    async jwt({ token }) {
      return token;
    },

    async session({ session, token }) {
      session.user = token.user || session.user || null;
      session.accessToken = token.accessToken || null;
      return session;
    },

    async signIn() {
      return true;
    },

    async redirect({ url, baseUrl }) {
      // Allow redirect to relative URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allow redirect to same origin URLs
      else if (new URL(url).origin === baseUrl) return url;
      // Default redirect to home
      return baseUrl;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  debug: process.env.NODE_ENV === "development" || process.env.NEXTAUTH_DEBUG === "true",
  secret: process.env.NEXTAUTH_SECRET,
};

if (process.env.NODE_ENV === "production") {
  if (!process.env.NEXTAUTH_SECRET) {
    console.error("[NextAuth] Missing required env var in production: NEXTAUTH_SECRET");
  }
}

export default NextAuth(authOptions);

