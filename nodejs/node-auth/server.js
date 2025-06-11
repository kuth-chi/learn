const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

require('dotenv').config();
// Set the port and hostname
const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || 'localhost';
// Secret key for JWT signing
const JWT_SECRET = process.env.APP_SECRET_KEY;
if (!JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined in the environment variables.');
    process.exit(1);
}
app.use(express.json());

let users = {}; // In-memory user storage for demonstration purposes
let otpStorage = {}; // In-memory OTP storage for demonstration purposes
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (!password || password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }
    if (users[email]) {
        return res.status(400).json({ message: 'User with this email already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    users[email] = { password: hashedPassword, role: 'user' }; // Default role is 'user'
    // In a real application, you would save the user to a database
    res.status(201).json({ message: 'User registered successfully.' });
});

// Login endpoint
app.post('/login', async (req, res) => {
    // Corrected to use email for login to match registration
    const { email, password } = req.body;
    const user = users[email];
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid email or password.' });
    }
    // The payload should identify the user uniquely
    const token = jwt.sign({ email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// Send OTP endpoint
app.post('/send-otp', (req, res) => {
    const { email } = req.body;
    // Corrected variable from 'username' to 'email'
    if (!users[email]) {
        return res.status(404).json({ message: 'User not found.' });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
    otpStorage[email] = { otp, timestamp: Date.now() }; // Store OTP and timestamp
    console.log(`OTP for ${email}: ${otp}`); // In a real application, send this via email or SMS
    res.json({ message: 'OTP sent successfully. It is valid for 5 minutes.' });
});
// Verify OTP endpoint
app.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    if (!users[email]) {
        return res.status(404).json({ message: 'User not found.' });
    }
    const storedOtpData = otpStorage[email];
    // Check if OTP exists and is not expired (e.g., 5 minutes validity)
    const fiveMinutes = 5 * 60 * 1000;
    if (!storedOtpData || storedOtpData.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP.' });
    }
    if (Date.now() - storedOtpData.timestamp > fiveMinutes) {
        delete otpStorage[email]; // Clear expired OTP
        return res.status(400).json({ message: 'OTP has expired.' });
    }
    delete otpStorage[email]; // Clear OTP after successful verification
    res.json({ message: 'OTP verified successfully.' });
});

// Authorization middleware
const authorize = (requiredRole) => (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // Corrected typo 'splite' to 'split' and added robust checking
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    // Added try-catch block to handle JWT errors (e.g., expired token, invalid signature)
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach decoded user info to the request object
        if (decoded.role !== requiredRole) {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

app.get('/admin', authorize('admin'), (req, res) => {
    // You can now access user info via req.user
    res.json({ message: `Welcome to the admin area, ${req.user.email}!` });
});
app.get('/user', authorize('user'), (req, res) => {
    res.json({ message: `Welcome to the user area, ${req.user.email}!` });
});

app.listen(port, hostname, () => {
    // Corrected to use variables for a dynamic and accurate log message
    console.log(`Server running at http://${hostname}:${port}/`);
});