const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.static("views"));

const PORT = process.env.PORT || 3000;

// Simulated user database (in memory)
const users = {} ?? localStorage.getItem("user"); // { email: { password, otp } }

// Serve static pages
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "views/login.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "views/register.html")));
app.get("/protected.html", (req, res) => res.sendFile(path.join(__dirname, "views/protected.html")));

// Register endpoint
app.post("/register", (req, res) => {
    const { email, password, confirm_password } = req.body;

    if (!email || !password || !confirm_password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirm_password) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    users[email] = { password }; // Save user
    res.status(200).json({ message: "Registration successful", user: { email } });
});

// Login endpoint
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const user = users[email];

    if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp; // Save OTP temporarily

    console.log(`OTP for ${email}: ${otp}`); // Simulate sending via email/SMS
    res.status(200).json({ message: "OTP sent", email });
});

// OTP verification
app.post("/verify-otp", (req, res) => {
    const { email, otp } = req.body;

    const user = users[email];
    if (!user || user.otp !== otp) {
        return res.status(401).json({ message: "Invalid OTP" });
    }

    delete user.otp; // Clear OTP after use
    res.status(200).json({ message: "Login successful" });
});

app.listen(PORT, () => {
    console.log(`Web App running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT}`);
});
