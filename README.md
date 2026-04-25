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
[I will fill this in with you as we write the code!]
