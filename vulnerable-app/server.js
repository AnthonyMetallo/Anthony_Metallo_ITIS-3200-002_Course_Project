const express = require('express');
const session = require('express-session');
const app = express();

app.use(express.urlencoded({ extended: true }));

// 1. VULNERABLE SESSION CONFIGURATION
app.use(session({
    secret: 'insecure-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        httpOnly: false, // VULNERABILITY: Document.cookie can read this (XSS risk)
        sameSite: 'lax'  // VULNERABILITY: Browser may send this cookie on cross-site POST requests
    }
}));

let userDatabase = { username: "User", email: "user@example.com" };

app.get('/', (req, res) => {
    if (!req.session.loggedIn) return res.send('<h1>Please <a href="/login">Login</a></h1>');
    res.send(`
        <h1>Welcome, ${userDatabase.username}</h1>
        <p>Email: <b>${userDatabase.email}</b></p>
        <hr>
        <form action="/update-email" method="POST">
            <input type="email" name="new_email" placeholder="New Email" required>
            <button type="submit">Update</button>
        </form>
    `);
});

app.get('/login', (req, res) => {
    req.session.loggedIn = true;
    res.send('Logged in successfully! <a href="/">Go Home</a>');
});

// 2. VULNERABLE ENDPOINT
app.post('/update-email', (req, res) => {
    // Check if logged in, but fails to check for a CSRF token
    if (!req.session.loggedIn) return res.status(401).send("Not logged in");

    // FLAW: The server trusts the browser's automatic cookie attachment
    userDatabase.email = req.body.new_email;
    console.log(`Email updated to: ${userDatabase.email}`);
    res.send(`Email updated to ${userDatabase.email}! <a href="/">Home</a>`);
});

app.listen(3000, () => console.log('Vulnerable server running on http://localhost:3000'));
