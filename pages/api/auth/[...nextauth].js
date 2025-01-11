// pages/api/auth/[...nextauth].js

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { CustomPrismaAdapter } from '../../../lib/customPrismaAdapter';
import bcrypt from 'bcrypt';
import prisma from '../../../lib/prisma';

export const authOptions = {
  adapter: CustomPrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'example@email.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            Customer: true,
            Photographer: true,
            Admin: true,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return null;
        }

        // Include photographer_id if the user is a photographer
        const photographer_id = user.Photographer ? user.Photographer.photo_id : null;

        return {
          id: user.id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          username: user.username,
          role: user.role,
          photographer_id,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'openid email profile',
        },
      },
      async profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          firstname: profile.given_name || '',
          lastname: profile.family_name || '',
          image: profile.picture || '',
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.firstname = user.firstname;
        token.lastname = user.lastname;
        token.username = user.username;
        token.role = user.role;
        token.photographer_id = user.photographer_id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          firstname: token.firstname,
          lastname: token.lastname,
          username: token.username,
          role: token.role,
          photographer_id: token.photographer_id
        };
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account.provider === 'google') {
        const existingUser = await prisma.user.findUnique({ where: { email: user.email } });
        if (existingUser) {
          return true;
        } else {
          return true; // Allow adapter to create user
        }
      }
      return true;
    },
  },
  events: {
    // Set 'pending' role for new users created via OAuth
    async createUser({ user }) {
      if (!user.role || user.role === 'pending') {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: 'pending' },
        });
      }
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug mode
};

export default NextAuth(authOptions);