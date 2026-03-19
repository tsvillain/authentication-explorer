# Authentication Explorer

A modern, interactive web application designed to visually demonstrate and explain the four most common types of authentication used in web development today.

## 🚀 The Authentication Flows

This project includes interactive, mocked frontend implementations of four distinct authentication strategies. By running the app, you can see exactly how the client and server exchange data during login and subsequent API requests.

### 1. Stateful (Session-Based) Authentication
In stateful authentication, the server keeps track of active user sessions in its memory or a database. 
- **The Flow**: The user submits credentials. The server verifies them, creates a session record, and sends back a unique `Session ID` (usually via an `HttpOnly` cookie).
- **Subsequent Requests**: The browser automatically includes the cookie with every request. The server reads the `Session ID`, looks it up in its database, and if valid, processes the request.
- **Pros**: Easy to revoke sessions (just delete from DB), server has absolute control.
- **Cons**: Harder to scale (requires a centralized session store if running multiple server instances).

### 2. Stateless (JWT) Authentication
In stateless authentication, the server doesn't store session data. Instead, it issues a mathematically signed token containing the user's data.
- **The Flow**: The user submits credentials. The server verifies them and generates a JSON Web Token (JWT) containing a payload (e.g., User ID, roles) signed with a secret key. The token is sent to the client.
- **Subsequent Requests**: The client explicitly attaches the JWT to the `Authorization: Bearer <token>` header of every request. The server validates the signature mathematically without needing to query a database.
- **Pros**: Highly scalable, completely stateless, tokens can be passed between different microservices easily.
- **Cons**: Difficult to revoke a standard JWT before it expires (requires blocklists), tokens can become large.

### 3. API Key Authentication
API Keys are long-lived, opaque strings typically used for server-to-server or programmatic access (like a bot or separate application).
- **The Flow**: A developer generates an API Key from a dashboard. The server stores a hashed version of this key.
- **Subsequent Requests**: The client application passes the API key in a custom header (e.g., `x-api-key`) with every request. The server hashes the incoming key and compares it to stored hashes.
- **Pros**: Simple to integrate, easy to track usage and rate-limit per application.
- **Cons**: Less secure for user-facing browser apps (keys are often hardcoded or long-lived), usually lacks fine-grained user permissions.

### 4. OAuth 2.0 (Delegated Authorization)
OAuth 2.0 allows a third-party application to obtain limited access to an HTTP service without the user having to share their main credentials.
- **The Flow**: The user clicks "Login with X". They are redirected to the Authorization Server (e.g., Google/GitHub). After logging in there, they consent to share data. The Authorization Server redirects the user back to the client application with an Authorization Code. The client application then exchanges this code with the Authorization Server for an Access Token.
- **Subsequent Requests**: The client uses the Access Token to make requests to the Resource Server (API) using the Bearer token scheme.
- **Pros**: Extremely secure, users don't share passwords with developers, standardized flow globally.
- **Cons**: Most complex to implement, requires multiple moving parts (Client, Resource Server, Authorization Server).

## 🛠 Tech Stack

- **Framework**: React via Vite
- **Language**: TypeScript
- **Styling**: Vanilla CSS, leveraging modern properties and a glassmorphism design language.

## 🏃‍♀️ Getting Started

To run this project locally:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open the provided `localhost` URL in your browser and explore the different flows!
