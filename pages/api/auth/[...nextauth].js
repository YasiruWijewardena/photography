// // pages/api/auth/[...nextauth].js

// import NextAuth from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import GoogleProvider from 'next-auth/providers/google';
// import { CustomPrismaAdapter } from '../../../lib/customPrismaAdapter';
// import bcrypt from 'bcrypt';
// import prisma from '../../../lib/prisma';

// export const authOptions = {
//   adapter: CustomPrismaAdapter(prisma),
//   providers: [
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         email: { label: 'Email', type: 'email', placeholder: 'example@email.com' },
//         password: { label: 'Password', type: 'password' },
//         loginType: {
//           label: 'Login Type',
//           type: 'text',
//           placeholder: 'optional - e.g. "admin"',
//         },
//       },
//       async authorize(credentials) {
//         const { email, password, loginType } = credentials;

//         const user = await prisma.user.findUnique({
//           where: { email },
//           include: {
//             Customer: true,
//             Photographer: true,
//             Admin: true,
//           },
//         });

//         if (!user || !user.password) {
//           return null;
//         }

//         const isValid = await bcrypt.compare(password, user.password);
//         if (!isValid) {
//           return null;
//         }

//         if (loginType === 'admin' && user.role !== 'admin') {
//           return null; // Not an admin in the DB, reject
//         }

//         // Include photographer_id if the user is a photographer
//         const photographer_id = user.Photographer ? user.Photographer.photo_id : null;

//         return {
//           id: user.id,
//           email: user.email,
//           firstname: user.firstname,
//           lastname: user.lastname,
//           username: user.username,
//           role: user.role,
//           photographer_id,
//           admin_level: user.Admin?.admin_level || null,
//         };
//       },
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       authorization: {
//         params: {
//           scope: 'openid email profile',
//         },
//       },
//       async profile(profile) {
//         return {
//           id: profile.sub,
//           email: profile.email,
//           firstname: profile.given_name || '',
//           lastname: profile.family_name || '',
//           image: profile.picture || '',
//         };
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
//         token.photographer_id = user.photographer_id;
//         token.admin_level = user.admin_level;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token) {
//         session.user = {
//           id: token.id,
//           email: token.email,
//           firstname: token.firstname,
//           lastname: token.lastname,
//           username: token.username,
//           role: token.role,
//           photographer_id: token.photographer_id,
//           admin_level: token.admin_level,
//         };
//       }
//       return session;
//     },
//     async signIn({ user, account }) {
//       if (account.provider === 'google') {
//         const existingUser = await prisma.user.findUnique({ where: { email: user.email } });
//         if (existingUser) {
//           return true;
//         } else {
//           return true; // Allow adapter to create user
//         }
//       }
//       return true;
//     },
//   },
//   events: {
//     // Set 'pending' role for new users created via OAuth
//     async createUser({ user }) {
//       if (!user.role || user.role === 'pending') {
//         await prisma.user.update({
//           where: { id: user.id },
//           data: { role: 'pending' },
//         });
//       }
//     },
//   },
//   pages: {
//     signIn: '/login',
//     error: '/auth/error',
//   },
//   session: {
//     strategy: 'jwt',
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   debug: true, // Enable debug mode
// };

// export default NextAuth(authOptions);

// pages/api/auth/[...nextauth].js

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { CustomPrismaAdapter } from '../../../lib/customPrismaAdapter';
import bcrypt from 'bcrypt';
import prisma from '../../../lib/prisma';

/**
 * NextAuth Configuration Options
 */
export const authOptions = {
  // Use a custom Prisma adapter to integrate with your Prisma schema
  adapter: CustomPrismaAdapter(prisma),

  // Define authentication providers
  providers: [
    // Credentials Provider for email/password authentication
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'example@email.com' },
        password: { label: 'Password', type: 'password' },
        loginType: {
          label: 'Login Type',
          type: 'text',
          placeholder: 'optional - e.g. "admin"',
        },
      },
      /**
       * Authorize user credentials
       * @param {Object} credentials - User credentials
       * @returns {Object|null} - User object if valid, else null
       */
      async authorize(credentials) {
        const { email, password, loginType } = credentials;

        // Fetch user from the database
        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            Customer: true,
            Photographer: true,
            Admin: true,
          },
        });

        // If user doesn't exist or doesn't have a password (e.g., OAuth user), reject
        if (!user || !user.password) {
          return null;
        }

        // Compare hashed passwords
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return null;
        }

        // If loginType is specified (e.g., admin), verify user's role
        if (loginType === 'admin' && user.role !== 'admin') {
          return null; // Not an admin in the DB, reject
        }

        // Include photographer_id if the user is a photographer
        const photographer_id = user.Photographer ? user.Photographer.photo_id : null;

        // Return user object with necessary fields
        return {
          id: user.id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          username: user.username,
          role: user.role,
          photographer_id,
          admin_level: user.Admin?.admin_level || null,
        };
      },
    }),

    // Google Provider for OAuth authentication
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'openid email profile',
        },
      },
      /**
       * Map OAuth profile to user object
       * @param {Object} profile - Google profile
       * @returns {Object} - Mapped user object
       */
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
    // Add other providers if needed
  ],

  // Define callback functions
  callbacks: {
    /**
     * JWT Callback
     * - Adds user information to the JWT token
     * - Fetches latest user data from DB if user object is not present
     * @param {Object} params - Callback parameters
     * @returns {Object} - Updated token
     */
    async jwt({ token, user }) {
      if (user) {
        // Initial sign-in, add user info to token
        token.id = user.id;
        token.email = user.email;
        token.firstname = user.firstname;
        token.lastname = user.lastname;
        token.username = user.username;
        token.role = user.role;
        token.photographer_id = user.photographer_id;
        token.admin_level = user.admin_level;
      } else if (token.id) {
        // Subsequent requests, fetch latest user data from DB
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          include: {
            Photographer: true,
            Customer: true,
            Admin: true,
          },
        });

        if (dbUser) {
          token.role = dbUser.role;
          token.username = dbUser.username;
          token.photographer_id = dbUser.Photographer ? dbUser.Photographer.photo_id : null;
          token.admin_level = dbUser.Admin?.admin_level || null;
        }
      }
      return token;
    },

    /**
     * Session Callback
     * - Exposes user information to the session object
     * @param {Object} params - Callback parameters
     * @returns {Object} - Updated session
     */
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          firstname: token.firstname,
          lastname: token.lastname,
          username: token.username,
          role: token.role,
          photographer_id: token.photographer_id,
          admin_level: token.admin_level,
        };
      }
      return session;
    },

    /**
     * Sign-In Callback
     * - Allows users to sign in via OAuth providers
     * @param {Object} params - Callback parameters
     * @returns {boolean} - Whether sign-in should be allowed
     */
    async signIn({ user, account }) {
      if (account.provider === 'google') {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email: user.email } });
        if (existingUser) {
          return true; // Allow sign-in
        } else {
          return true; // Allow adapter to create user
        }
      }
      return true; // Allow other providers/sign-ins
    },
  },

  // Define event handlers
  events: {
    /**
     * CreateUser Event
     * - Sets the 'pending' role for new users created via OAuth
     * @param {Object} params - Event parameters
     */
    async createUser({ user }) {
      if (!user.role || user.role === 'pending') {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: 'pending' },
        });
      }
    },
  },

  // Define custom pages
  pages: {
    signIn: '/login',
    error: '/auth/error', // Error code passed in query string as ?error=
  },

  // Configure session handling
  session: {
    strategy: 'jwt', // Use JWT strategy
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Define secret for signing JWTs
  secret: process.env.NEXTAUTH_SECRET,

  // Enable debug mode for development
  debug: true,
};

export default NextAuth(authOptions);