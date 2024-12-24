// pages/api/auth/signup/customer.js

import nextConnect from 'next-connect';
import multer from 'multer';
import prisma from '../../../../lib/prisma';
import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs';

// Ensure the uploads directory exists
const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'customers');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer storage with validation
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error('Only JPEG, JPG, and PNG files are allowed!'));
};

// Initialize Multer with storage and file filter
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit per file
    fileFilter: fileFilter,
});

// Create a Next-Connect handler
const handler = nextConnect({
    onError(error, req, res) {
        console.error('Error in API route:', error);
        res.status(500).json({ error: `Something went wrong! ${error.message}` });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});

// Apply the Multer middleware
handler.use(upload.single('profile_image'));

// Handle POST requests
handler.post(async (req, res) => {
    const { username, email, password } = req.body;

    // Extract file path
    const profile_image = req.file ? `/uploads/customers/${req.file.filename}` : null;

    // Input Validation
    if (!username || !email || !password) {
        // Remove uploaded file if validation fails
        if (profile_image) {
            const filePath = path.join(process.cwd(), 'public', profile_image);
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
        }
        return res.status(400).json({ error: 'Username, email, and password are required.' });
    }

    // Additional validations (e.g., email format, password strength)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        if (profile_image) {
            const filePath = path.join(process.cwd(), 'public', profile_image);
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
        }
        return res.status(400).json({ error: 'Invalid email format.' });
    }

    if (password.length < 6) {
        if (profile_image) {
            const filePath = path.join(process.cwd(), 'public', profile_image);
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
        }
        return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    try {
        // Check if the user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            // Remove uploaded file if user exists
            if (profile_image) {
                const filePath = path.join(process.cwd(), 'public', profile_image);
                fs.unlink(filePath, (err) => {
                    if (err) console.error('Error deleting file:', err);
                });
            }
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user and customer in a transaction
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: 'customer',
                Customer: {
                    create: {
                        profile_image,
                        // Add any additional fields for Customer here
                    },
                },
            },
            include: {
                Customer: true,
            },
        });

        return res.status(201).json({ message: 'User created successfully', userId: user.id });
    } catch (error) {
        console.error('Error during customer signup:', error);

        // Remove uploaded file in case of error
        if (profile_image) {
            const filePath = path.join(process.cwd(), 'public', profile_image);
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
        }

        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Disable the default body parser, as multer handles it
export const config = {
    api: {
        bodyParser: false,
    },
};

export default handler;
