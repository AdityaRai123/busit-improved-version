import express from 'express';
import connectToDatabase from '../lib/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const router = express.Router();

// Input validation middleware
const validateRegistration = (req, res, next) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }
    
    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    
    next();
};

// Register Route
router.post('/register', validateRegistration, async(req, res) => {
    const { username, email, password } = req.body;
    try {
        const db = await connectToDatabase();
        
        // Check if user already exists
        const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ message: "User already exists" });
        }
        
        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);
        
        // Insert new user
        await db.query("INSERT INTO users (username, email, password, created_at) VALUES(?, ?, ?, NOW())", 
            [username, email, hashPassword]);
        
        return res.status(201).json({ message: "User created successfully" });
    } catch(err) {
        console.error('Registration error:', err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Login Route
router.post('/login', validateLogin, async(req, res) => {
    const { email, password } = req.body;
    try {
        const db = await connectToDatabase();
        
        // Find user by email
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        const user = users[0];
        
        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email }, 
            "jwt-secret-key", 
            { expiresIn: '24h' }
        );
        
        return res.status(200).json({ 
            token: token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch(err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// JWT Verification Middleware
export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(403).json({ message: "No token provided" });
        }
        
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(403).json({ message: "No token provided" });
        }
        
        const decoded = jwt.verify(token, "jwt-secret-key");
        req.userId = decoded.id;
        req.userEmail = decoded.email;
        next();
    } catch(err) {
        console.error('Token verification error:', err);
        return res.status(401).json({ message: "Invalid token" });
    }
};

// Get User Profile Route
router.get('/profile', verifyToken, async(req, res) => {
    try {
        const db = await connectToDatabase();
        const [users] = await db.query('SELECT id, username, email, created_at FROM users WHERE id = ?', [req.userId]);
        
        if (users.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        
        return res.status(200).json({ user: users[0] });
    } catch(err) {
        console.error('Profile error:', err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Update User Profile Route
router.put('/profile', verifyToken, async(req, res) => {
    const { username } = req.body;
    
    if (!username) {
        return res.status(400).json({ message: "Username is required" });
    }
    
    try {
        const db = await connectToDatabase();
        await db.query('UPDATE users SET username = ? WHERE id = ?', [username, req.userId]);
        
        return res.status(200).json({ message: "Profile updated successfully" });
    } catch(err) {
        console.error('Profile update error:', err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    
    try {
        const db = await connectToDatabase();
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate reset token
        const resetToken = jwt.sign({ id: users[0].id }, "jwt-secret-key", { expiresIn: '1h' });
        
        // Create transporter for sending email
        const transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: 'busit.org@gmail.com',
                pass: 'nzed vldu enmj kofs'
            }
        });

        // Email content
        const mailOptions = {
            from: 'busit.org@gmail.com',
            to: email,
            subject: 'BUSIT - Password Reset Request',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #3B82F6; text-align: center;">BUSIT</h1>
                    <h2 style="color: #1F2937;">Password Reset Request</h2>
                    <p>Hello ${users[0].username},</p>
                    <p>You requested to reset your password. Click the button below to reset it:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="http://localhost:5173/reset-password/${resetToken}" 
                           style="background: linear-gradient(135deg, #3B82F6, #8B5CF6); 
                                  color: white; 
                                  padding: 12px 24px; 
                                  text-decoration: none; 
                                  border-radius: 8px; 
                                  display: inline-block;">
                            Reset Password
                        </a>
                    </div>
                    <p style="color: #6B7280; font-size: 14px;">
                        This link will expire in 1 hour. If you didn't request this, please ignore this email.
                    </p>
                    <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
                    <p style="color: #6B7280; font-size: 12px; text-align: center;">
                        Your Journey, Our Priority
                    </p>
                </div>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);
        
        return res.status(200).json({ message: "Password reset link sent to your email" });
    } catch (err) {
        console.error('Forgot password error:', err);
        return res.status(500).json({ message: "Error sending reset email" });
    }
});

// Reset Password Route
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
        return res.status(400).json({ message: "Token and new password are required" });
    }
    
    if (newPassword.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    
    try {
        const decoded = jwt.verify(token, "jwt-secret-key");
        const db = await connectToDatabase();
        
        const hashPassword = await bcrypt.hash(newPassword, 10);
        await db.query('UPDATE users SET password = ? WHERE id = ?', [hashPassword, decoded.id]);
        
        return res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        console.error('Reset password error:', err);
        return res.status(400).json({ message: "Invalid or expired token" });
    }
});

export default router;