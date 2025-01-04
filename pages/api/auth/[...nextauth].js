// // pages/api/auth/[...nextauth].js

// import NextAuth from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import { PrismaAdapter } from '@next-auth/prisma-adapter';
// import prisma from '../../../lib/prisma'; // Adjust the path as necessary
// import bcrypt from 'bcrypt';

// export const authOptions = {
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         email: { label: 'Email', type: 'email', placeholder: 'example@email.com' },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials) {
//         const { email, password } = credentials;

//         // Find the user by email and include relevant relations
//         const user = await prisma.user.findUnique({
//           where: { email },
//           include: {
//             Admin: true,
//             Customer: true,
//             Photographer: {
//               include: {
//                 Subscription: true,
//               },
//             },
//           },
//         });

//         if (!user) {
//           // No user found with that email
//           return null;
//         }

//         // Check if password matches
//         const isValid = await bcrypt.compare(password, user.password);
//         if (!isValid) {
//           // Invalid password
//           return null;
//         }

//         // Prepare the user object to return
//         let userData = {
//           id: user.id,
//           email: user.email,
//           firstname: user.firstname,
//           lastname: user.lastname,
//           username: user.username,
//           role: user.role,
//         };

//         if (user.role === 'admin') {
//           if (user.Admin) {
//             userData.admin_level = user.Admin.admin_level;
//           } else {
//             // Admin relation not found
//             return null;
//           }
//         } else if (user.role === 'photographer') {
//           if (user.Photographer) {
//             userData.photographer_id = user.id;
//             userData.is_approved = user.Photographer.is_approved;
//             userData.bio = user.Photographer.bio;
//             userData.website = user.Photographer.website;
//             userData.instagram = user.Photographer.instagram;
//             userData.mobile_num = user.Photographer.mobile_num;
//             userData.profile_picture = user.Photographer.profile_picture;
//             userData.subscription_id = user.Photographer.subscription_id;
//             userData.subscription_name = user.Photographer.Subscription?.name || '';
//           } else {
//             // Photographer relation not found
//             return null;
//           }
//         } else if (user.role === 'customer') {
//           if (user.Customer) {
//             userData.customer_id = user.Customer.cust_id;
//           } else {
//             // Customer relation not found
//             return null;
//           }
//         }

//         return userData;
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.email = user.email;
//         token.firstname = user.firstname;
//         token.lastname = user.lastname;
//         token.username = user.username;
//         token.role = user.role;

//         if (user.role === 'admin') {
//           token.admin_level = user.admin_level;
//         } else if (user.role === 'photographer') {
//           token.photographer_id = user.photographer_id;
//           token.is_approved = user.is_approved;
//           token.bio = user.bio;
//           token.website = user.website;
//           token.instagram = user.instagram;
//           token.mobile_num = user.mobile_num;
//           token.profile_picture = user.profile_picture;
//           token.subscription_id = user.subscription_id;
//           token.subscription_name = user.subscription_name;
//         } else if (user.role === 'customer') {
//           token.customer_id = user.customer_id;
//         }
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token) {
//         session.user = {
//           id: token.id, // Ensure the user ID is included in the session
//           email: token.email,
//           firstname: token.firstname,
//           lastname: token.lastname,
//           username: token.username,
//           role: token.role,
//         };

//         if (token.role === 'admin') {
//           session.user.admin_level = token.admin_level;
//         } else if (token.role === 'photographer') {
//           session.user.photographer_id = token.photographer_id;
//           session.user.is_approved = token.is_approved;
//           session.user.bio = token.bio;
//           session.user.website = token.website;
//           session.user.instagram = token.instagram;
//           session.user.mobile_num = token.mobile_num;
//           session.user.profile_picture = token.profile_picture;
//           session.user.subscription_id = token.subscription_id;
//           session.user.subscription_name = token.subscription_name;
//         } else if (token.role === 'customer') {
//           session.user.customer_id = token.customer_id;
//         }
//       }
//       return session;
//     },
//   },
//   session: {
//     strategy: 'jwt',
//   },
//   debug: process.env.NODE_ENV === 'development',
//   secret: process.env.NEXTAUTH_SECRET,
// };

// export default NextAuth(authOptions);

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

        return {
          id: user.id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          username: user.username,
          role: user.role,
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