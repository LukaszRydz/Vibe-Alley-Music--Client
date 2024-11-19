# User Account Management Server

This is a server for managing user accounts. It handles tasks such as:

- User registration, login, and password reset.
- Integration with the Spotify API.
- Other related functionalities.

## Tech Stack

- **TypeScript**: For a strongly typed development experience.
- **Node.js**: Server runtime.
- **Spotify API**: For integrating Spotify services.
- **MongoDB**: As the database for storing user data.

## Getting Started

To set up and run the server, follow these steps:

### 1. Create a `.env` File

Create a `.env` file in the root directory and populate it with the following variables:

```env
API_PORT={Your API port, e.g., `8080`}
API_HOST={Your API host, e.g., `localhost`}
API_PASSWORD_SECRET={A random string for password encryption}

MONGODB_COLLECTION=SHOP
MONGODB_PASSWORD={Your MongoDB password}

JWT_COOKIE_NAME=music-store-cookie
JWT_SECRET={A random string for JWT tokens}
JWT_EXPIRES_IN=90d
JWT_ALGORITHM=HS256

EMAIL_ACCOUNT={Your company email account}
EMAIL_PASSWORD={Your Gmail app password}

HOST_DB="mongodb://localhost:27017/SHOP"
HOST_SHOP={Your shop host, e.g., `"http://localhost:8050"`}
HOST_SPOTIFY={Your Spotify host, e.g., `"http://localhost:8050"`}
HOST_FRONT={Your front-end host, e.g., `"http://localhost:8050"`}
```

2. Install Dependencies:
   Run the following command to install the required modules:
   - `npm install`
4. Start the Server
   `npm start`
