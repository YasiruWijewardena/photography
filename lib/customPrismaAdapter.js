// // lib/customPrismaAdapter.js

// import { PrismaAdapter } from '@next-auth/prisma-adapter';
// import prisma from './prisma'; // Adjust the path as necessary

// export function CustomPrismaAdapter(prismaClient) {
//   return {
//     ...PrismaAdapter(prismaClient),
//     async createUser(user) {
//       const { name, email, image } = user;

//       // Split the name into firstname and lastname
//       const [firstname, ...lastnameArr] = name ? name.split(' ') : ['FirstName', 'LastName'];
//       const lastname = lastnameArr.join(' ') || 'LastName';

//       // Generate a unique username based on email
//       const baseUsername = email.split('@')[0].toLowerCase().replace(/\W/g, '');
//       let username = baseUsername;
//       let count = 1;

//       while (await prismaClient.user.findUnique({ where: { username } })) {
//         username = `${baseUsername}${count}`;
//         count++;
//       }

//       // Create the user with role 'pending'
//       return prismaClient.user.create({
//         data: {
//           email,
//           firstname,
//           lastname,
//           username,
//           image: image || null,
//           role: 'pending', // Temporary role until role selection
//         },
//       });
//     },
//     // You can override other methods if needed
//   };
// }

// lib/customPrismaAdapter.js

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./prisma";
import { generateUniqueUsername } from "./usernameUtils"; // Ensure this utility exists

export function CustomPrismaAdapter(p) {
  const adapter = PrismaAdapter(p);

  return {
    ...adapter,
    createUser: async (data) => {
      console.log('CustomPrismaAdapter createUser data:', data);
      const { role, username, ...userData } = data;

      // Set 'role' to 'pending' if not provided
      userData.role = role || 'pending';

      let finalUsername = username;

      if (!finalUsername) {
        // Generate a unique username based on firstname and lastname
        const baseUsername = `${userData.firstname}${userData.lastname}`;
        finalUsername = await generateUniqueUsername(baseUsername);
        if (!finalUsername) {
          throw new Error('Unable to generate a unique username.');
        }
        userData.username = finalUsername;
      }

      console.log('CustomPrismaAdapter createUser userData:', userData);

      return p.user.create({
        data: userData,
      });
    },
  };
}