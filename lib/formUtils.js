// lib/formUtils.js

import { IncomingForm } from 'formidable';
import fs from 'fs-extra';
import path from 'path';

/**
 * Parses an incoming form request using formidable.
 * @param {IncomingMessage} req - The incoming HTTP request.
 * @returns {Promise<{ fields: Object, files: Object }>} - The parsed fields and files.
 */
export const parseForm = async (req) => {
  const tempDir = path.join(process.cwd(), 'public', 'uploads', 'temp');
  await fs.ensureDir(tempDir);

  const form = new IncomingForm({
    uploadDir: tempDir,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB
  });

  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  return { fields, files };
};

/**
 * Extracts a single value from a field that might be an array.
 * @param {any} field - The field value.
 * @returns {any} - The first element if it's an array, else the value itself.
 */
export const getSingleValue = (field) => (Array.isArray(field) ? field[0] : field);

/**
 * Moves a file from the temporary directory to the final destination.
 * @param {Object} file - The file object from formidable.
 * @param {string} destinationDir - The final directory path.
 * @param {string} newFileName - The new file name.
 * @returns {Promise<string>} - The URL path to the moved file.
 */
export const moveFile = async (file, destinationDir, newFileName) => {
  await fs.ensureDir(destinationDir);

  const newFilePath = path.join(destinationDir, newFileName);
  await fs.move(file.filepath, newFilePath, { overwrite: true });

  return `/uploads/profile_pictures/${newFileName}`;
};
