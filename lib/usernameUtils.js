// lib/usernameUtils.js

import prisma from './prisma';

const reservedUsernames = [
  'admin',
  'support',
  'login',
  'signup',
  'dashboard',
  // Add more reserved words as needed
];

// Check if username is reserved or already taken
export const checkReservedUsername = async (username) => {
  if (reservedUsernames.includes(username.toLowerCase())) {
    return false;
  }
  const user = await prisma.user.findUnique({ where: { username } });
  if (user) {
    return false;
  }
  return true;
};

// Generate a unique username
export const generateUniqueUsername = async (baseUsername) => {
  let username = baseUsername.toLowerCase().replace(/\s+/g, '');
  let count = 1;

  while (!(await checkReservedUsername(username))) {
    username = `${baseUsername.toLowerCase().replace(/\s+/g, '')}${count}`;
    count++;
    if (count > 100) {
      // Prevent infinite loop
      return null;
    }
  }

  return username;
};