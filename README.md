# Anthony_Metallo_ITIS-3200-002_Course_Project
# Security Mechanisms in Practice: Session & CSRF Defense

## System Overview
This project demonstrates a web-based Account Manager. It explores the vulnerability of **Cross-Site Request Forgery (CSRF)** and the risks of insecure session management.

## Project Structure
- `/vulnerable-app`: A Node.js/Express server that trusts all authenticated requests.
- `/secure-app`: A Node.js/Express server implementing a **Synchronizer Token Pattern** and **Secure Cookie Attributes**.
- `/attacker-site`: A simulated malicious website that triggers a CSRF attack against the vulnerable server.

## Security Mechanisms Deployed
1. **Primary:** Synchronizer Token Pattern (Custom implementation).
2. **Supporting:** Cookie Security Flags (`HttpOnly`, `SameSite=Strict`).

## How to Run the Demonstration
The Vulnerable Exploit (Proof of Concept)
  1. Start the Server: Navigate to /vulnerable-app in your terminal and run node server.js.
  2. Authenticate: Go to http://localhost:3000/login to establish a session, then view the home page at http://localhost:3000/.
  3. The Attack: Open attacker-site/malicious-form.html in your browser.
  4. The Result: After a 3-second delay, the page will redirect. Refresh http://localhost:3000/ to see that the email has been changed to attacker@malicious.com without user interaction.
  5. Note: For this demo to work on modern browsers, SameSite was set to false in the vulnerable config to simulate older, less secure browser environments.

The Secure Defense (Mitigation)
  1. Start the Server: Navigate to /secure-app and run node server.js.
  2. Authenticate: Go to http://localhost:4000/login.
  3. Attempt Attack: Try to run malicious-form.html against port 4000. The browser will likely return Not logged in because the SameSite=Strict cookie attribute blocks the session cookie from being sent.
  4. Verify Token Logic: On the Secure Home Page (localhost:4000), click the "Submit No-Token Request" button.
  5. The Result: The server returns a 403 Forbidden error. This proves that even if a request is authenticated, it is rejected if the unique csrf_token is missing or invalid.
