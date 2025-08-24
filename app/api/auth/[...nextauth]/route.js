// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { compare } from 'bcrypt';
import prisma from '@/lib/prisma';
import { getUserByEmail } from '@/lib/user';

export const authOptions = {
  adapter: PrismaAdapter(prisma),  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }
        
        const user = await getUserByEmail(credentials.email);
        
        if (!user || !user.password) {
          throw new Error("No user found with this email");
        }
        
        const isPasswordCorrect = await compare(
          credentials.password,
          user.password
        );
          if (!isPasswordCorrect) {
          throw new Error("Invalid password");
        }
        
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/login',
  },  callbacks: {
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
      }
      if (token?.role) {
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
      }
      
      // Always fetch fresh role data from database on every JWT call
      // This ensures role changes are reflected immediately
      if (token.email) {
        try {
          const dbUser = await getUserByEmail(token.email);
          token.role = dbUser?.role || 'USER';
        } catch (error) {
          console.error('Error fetching user role:', error);
          token.role = token.role || 'USER'; // Fallback to existing role
        }
      }
      
      return token;
    },
    // Properly handle redirect to support callbackUrl
    async redirect({ url, baseUrl }) {
      // If the URL is absolute and belongs to our app, use it
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // If the URL is relative (starts with /), join it with the base URL
      else if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // Otherwise, return to the base URL
      return baseUrl;
    }
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };