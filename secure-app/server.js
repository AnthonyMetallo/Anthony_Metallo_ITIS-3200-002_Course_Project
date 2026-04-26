const express = require('express');
const session = require('express-session');
const crypto = require('crypto'); // Used to generate cryptographically strong random tokens
const app = express();

// Middleware to extract data from HTML forms (POST requests)
app.use(express.urlencoded({ extended: true }));

// 1. SECURE SESSION CONFIGURATION
app.use(session({
    secret: 'a-very-strong-secret-key', // Signs the session ID cookie to prevent tampering
    resave: false,
    saveUninitialized: true,
    cookie: { 
        httpOnly: true,    // SECURITY: Prevents client-side scripts (XSS) from accessing the cookie
        sameSite: 'strict',// SECURITY: Tells the browser NEVER to send this cookie on cross-site requests
        secure: false      // In production, set to 'true' to require HTTPS
    }
}));

// Mock database to track account state
let userDatabase = { username: "User", email: "user@example.com" };

// ROUTE: Home Page
app.get('/', (req, res) => {
    // Check if the user is authenticated via the session
    if (!req.session.loggedIn) return res.send('<h1>Please <a href="/login">Login</a></h1>');
    
    // Retrieve the unique CSRF token generated at login
    const csrfToken = req.session.csrfToken;

    res.send(`
        <h1>Secure Account Manager</h1>
        <p>Email: <b>${userDatabase.email}</b></p>
        <hr>
        <h3>Legitimate Update (With Token)</h3>
        <form action="/update-email" method="POST">
            <input type="hidden" name="csrf_token" value="${csrfToken}">
            <input type="email" name="new_email" placeholder="New Email" required>
            <button type="submit">Secure Update</button>
        </form>

        <hr style="margin-top: 40px">
        <h3 style="color: red;">Demo: Request WITHOUT Token</h3>
        <p>This form simulates an internal failure or a bypass attempt where the token is missing.</p>
        <form action="/update-email" method="POST">
            <input type="email" name="new_email" value="hacker@test.com" readonly>
            <button type="submit">Submit No-Token Request</button>
        </form>
    `);
});

// ROUTE: Login
app.get('/login', (req, res) => {
    req.session.loggedIn = true;
    // MECHANISM: Generate a 64-character hex string as a unique CSRF token for this session
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
    res.send('Logged in securely! <a href="/">Go Home</a>');
});

// ROUTE: The Protected Action
app.post('/update-email', (req, res) => {
    // LAYER 1: Authentication Check (Confirms 'Who' is asking)
    if (!req.session.loggedIn) return res.status(401).send("Not logged in");

    // LAYER 2: CSRF Token Verification (Confirms the request was 'Intentional')
    const tokenFromForm = req.body.csrf_token;
    const tokenFromSession = req.session.csrfToken;

    // If the token is missing or doesn't match the one in the session, reject the request
    if (!tokenFromForm || tokenFromForm !== tokenFromSession) {
        console.log("ALERT: Potential CSRF Attack Blocked!");
        return res.status(403).send("<h1>403 Forbidden</h1><p>CSRF Token Missing or Invalid.</p>");
    }

    // SUCCESS: Both layers passed
    userDatabase.email = req.body.new_email;
    res.send(`Email updated securely to ${userDatabase.email}! <a href="/">Home</a>`);
});

app.listen(4000, () => console.log('Secure server running on http://localhost:4000'));
