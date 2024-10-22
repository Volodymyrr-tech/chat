# REALTIME CHAT ON NEST.JS AND VANILLA JS

## STACK

### FRONT END

- JavaScript
- HTML
- CSS

### BACK END

- Nest.js
- PostgreSQL

### HOSTING

The back end is hosted on docker so to run application:
cd server
docker compose up --build

Front end is simply goes on live server or
npm install
npm start

### PROJECT OVERVIEW

## Key Functionalities

- Login

Users enter their name and click "Login" to authenticate.

If the login is successful, the chat UI is displayed.

- Creating Chats

Users can create new group or private chats by clicking the "+" button.

A modal is displayed where the user can enter the details (group name or participant names).

- Sending Messages

Users can type messages and click "Send" to communicate.

The messages are displayed in real-time for all participants in the selected chat.

- Real-Time Updates

The frontend connects to the backend using Socket.IO for WebSocket connections, enabling real-time updates for private and group messages.

Incoming messages are automatically added to the chat view

- Validation

The user is notified of the application requirements if they use an incorrect method of interaction with the app

## Back end project structure

- The backend code is organized into different modules, following a modular architecture that makes the application easier to manage and extend. The directory structure is as follows:

- auth: Handles user authentication using JWT.

- config: Contains configuration settings, including TypeORM configurations.

- modules: Contains the core features of the chat application, including users, groups, and messages.

- app.module.ts: The main entry point for the application, importing all necessary modules.

- main.ts: The bootstrap file that initializes the NestJS application.

## Database Overview

- The application uses PostgreSQL as the database, and TypeORM is used for interacting with the database. The main entities are:

- User: Stores user information such as name and ID.

- Group: Stores group chat information, including the group name and members.

- PrivateMessage: Stores private messages between two users.

- GroupMessage: Stores messages sent in group chats.

## Key Functionalities

- User Authentication

The Auth Module uses JWT for secure authentication.

Users authenticate by providing a username, and a JWT token is generated to authorize subsequent requests.

- Group Management

Users can create groups or join existing ones via the Groups Module.

Groups are stored in the database, with each group containing multiple users.

- Real-Time Messaging

The Chat Gateway in the Messages Module uses Socket.IO to manage real-time communication.

Users are joined to rooms (either private or group) upon connecting, enabling them to receive messages in real-time.

- Persistent Message Storage

PrivateMessage and GroupMessage entities are used to store messages in the database.

Users can fetch historical messages using the endpoints provided by messages.controller.ts

## API Overview

- Authentication Endpoint (/auth/login): Accepts a username and returns a JWT token.

- User Endpoints (/users): Provides endpoints to retrieve user information, such as searching for users by name.

- Group Endpoints (/groups): Allows creating groups, adding users to groups, and retrieving group information.

- Message Endpoints (/messages): Allows fetching message history for a user.

## ISSUES (FUTURE UPDATES)

- chat history (implemented only on back end)
- ability to sent messages to specific group in the chat
- notifications
