# Distributor Order Management API

## Task 1 

# About the Project
This project is the starting point of a Distributor Order Management API. Task 1 focuses on setting up the Express application, organizing the project structure, and implementing basic middleware and error handling.

# Technologies Used
 Node.js
 Express.js
 JavaScript
 dotenv
 Nodemon
 ESLint
 Prettier


# How to Run the Project

1. Clone the repository.
2. Install dependencies:

# bash
npm install

3. Create a .env file using .env.example as a reference.

4. Start the development server:

use command
npm run dev


To start normally:
npm start


# API Endpoint

Method: GET

Endpoint: /health

Description: Checks if the API is running


Example Response:

{
  "status": "ok",
  "service": "distributor-api"
}



### What I Implemented

. Set up the Express application and project structure.
. Separated application setup (app.js) from server startup (server.js).
. Configured environment variables using dotenv.
. Implemented request logging with method, path, status code, and response time.
. Added 404 handling for unknown routes.
. Implemented centralized error handling.
. Created a custom AppError class.
. Configured development, production, linting, and formatting scripts.


### Design Decisions

. Kept application setup and server startup separate.
. Used dotenv for environment configuration.
. Used centralized error handling to manage errors in one place.
. Placed error-handling middleware after the routes.



### Task 1 Status

Task 1 : Project Foundation completed.


# Research Notes

1. Middleware: Middleware functions run during the request-response cycle. Their order matters because each middleware runs in the order it is registered.

2. Error Handling: Express recognizes error-handling middleware through its four parameters: err, req, res, and next. It should be placed after the routes.

3. app.js and server.js: The app.js file handles Express configuration, middleware, and routes, while server.js starts the server and listens on a port. Keeping them separate makes testing easier.

4. dotenv: Dotenv loads variables from the .env file into process.env. We do not commit .env because it may contain secrets. Instead, we commit .env.example as a reference.

### Bug Log

Bug 1: Error Handler Position

Symptom: The custom error handler did not catch route errors when placed before the routes.
 Cause: The error handler was registered before the routes.
 Fix: Moved the error handler below the routes.
 Lesson: Error-handling middleware should be placed after the routes.

Bug 2: Missing .env File

 Symptom: The server started using the default port when the .env file was missing.
 Cause: A fallback port was configured in the application.
 Fix: Added a check for the missing PORT variable and a clear error message.
 Lesson: Required environment variables should be checked during startup.

Bug 3: Async Route Error

 Symptom: Tested an error thrown inside an async route handler.
 Cause: Express 5 handles rejected promises from async route handlers automatically.
 Fix: Verified that the error reached the central error handler and returned the expected JSON response.
 Lesson: Understanding Express version behavior helps avoid unnecessary error-handling code.


