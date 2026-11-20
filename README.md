# Distributor Order Management API

A RESTful API built with Node.js and Express.js for managing distributor operations.

## Technologies

- Node.js, Express.js, JavaScript
- dotenv, Nodemon
- Zod, ESLint, Prettier

## Setup

bash
npm install


Create a `.env` file using `.env.example`, then run:
bash
npm run dev


---

# Task 1 – Project Foundation

## Implementation

- Set up Express application and project structure.
- Separated `app.js` and `server.js`.
- Configured dotenv and request logging.
- Implemented 404 and centralized error handling.
- Created a custom AppError class.
- Configured development and formatting scripts.

## API Endpoint

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Check API status |

Response:

```json
{
  "status": "ok",
  "service": "distributor-api"
}
```

## Bug Log

1. Error Handler Position

- Symptom: Route errors were not caught.
- Cause: Error handler was registered before routes.
- Fix: Moved it below routes.
- Lesson: Middleware order matters.

2. Missing .env

- Symptom: Server used a default port.
- Cause: Missing PORT variable was not checked.
- Fix: Added startup validation.
- Lesson: Validate required environment variables.

3. Async Route Error

- Symptom: Async route errors needed verification.
- Cause: Express 5 handles rejected promises automatically.
- Fix: Verified errors reached the central handler.
- Lesson: Understand framework behavior before adding unnecessary code.

---

# Task 2 – Customer API

## Implementation

Implemented Customer CRUD operations using a layered architecture.

- Routes and controllers
- Service and repository layers
- Zod request validation
- Duplicate email prevention
- Centralized error handling

## API Endpoints

Base URL: `http://localhost:5000/api/customers`

| Method | Endpoint | Description |

| POST | /api/customers | Create customer |
| GET | /api/customers | Get all customers |
| GET | /api/customers/:id | Get customer by ID |
| PUT | /api/customers/:id | Update customer |
| DELETE | /api/customers/:id | Delete customer |

## Validation Rules

- Name and company are required.
- Email must be valid.
- Phone is optional.
- Status must match an allowed enum value.

## Bug Log & Security Testing

1. Invalid Customer Data

- Symptom: Invalid names, empty bodies, and malformed JSON caused unexpected errors.
- Cause: Missing or incomplete request validation.
- Fix: Added Zod validation and JSON error handling.
- Lesson: Validate input before processing.

2. Duplicate Emails

- Symptom: `A@x.com` and `a@x.com` could be treated differently.
- Cause: Case-sensitive email comparison.
- Fix: Normalize emails to lowercase; return `409 Conflict` for duplicates.
- Lesson: Normalize data before uniqueness checks.

3. Deleted Customer Retrieval

- Symptom: Deleted customers could remain accessible.
- Cause: Incomplete deletion or not-found handling.
- Fix: Implemented repository deletion and missing-record handling.
- Lesson: Deleted records should not be retrievable.

4. Mass Assignment Vulnerability

- Symptom: Extra fields such as `"role": "ADMIN"` could modify unauthorized properties.
- Cause: Unrestricted assignment of request data.
- Fix: Restrict updates to permitted customer fields.
- Lesson: Never trust client-provided fields for sensitive properties.

## Testing

Tested using Thunder Client:

- CRUD operations
- Invalid input and JSON
- Duplicate email addresses
- Deleted customer retrieval
- Unauthorized update fields

Status: Customer API implementation and testing completed.

---

# Research Notes

- Middleware: Runs during the request-response cycle.
- Error Handling: Express error middleware uses `err, req, res, next`.
- Layered Architecture: Separates responsibilities for maintainability.
- dotenv: Loads environment variables.
- Zod: Provides schema-based validation.
- Mass Assignment: Unrestricted field assignment can expose sensitive properties.

---

# Project Progress

| Task | Status |
|---|---|
| Task 1 – Project Foundation | Completed |
| Task 2 – Customer API | Completed |
| Task 2 – API Testing | Completed |
| README Documentation | Updated |
