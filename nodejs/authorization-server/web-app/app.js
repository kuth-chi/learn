const express = require("express");
const axios = require("axios");
const path = require("path");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4001;
app.use(express.json());
app.use(express.static("views"));

// /oauth-login: Redirects user to OAuth Server for authentication
app.get("/oauth-login", (req, res) => {
    const email = "admin@example.com"; // Hardcoded for testing
    const password = "admin123"; // Hardcoded for testing

    res.redirect(`http://localhost:5001/authorize?client_id=myClient&redirect_uri=http://localhost:4001/oauth-callback&state=xyz&email=${email}&password=${password}`);
});

// /oauth-callback: Handles the authorization code and exchanges it for a token
app.get("/oauth-callback", async (req, res) => {
    const authCode = req.query.code;

    if (!authCode) {
        return res.status(400).send("Missing authorization code");
    }

    try {
        const tokenRes = await axios.post("http://localhost:5001/token", {
            code: authCode,
            client_id: "myClient"
        });

        const accessToken = tokenRes.data.access_token;

        res.send(`<script>
            localStorage.setItem("authToken", "${accessToken}");
            window.location.href = "protected.html";
        </script>`);
    } catch (error) {
        res.status(500).send("Failed to exchange authorization code for token");
    }
});

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "views", "login.html")));

app.listen(PORT, () => console.log(`Web App running on port ${PORT}`));