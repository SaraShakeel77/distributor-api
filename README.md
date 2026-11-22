# Distributor Order Management API

A RESTful API built with Node.js and Express.js for managing distributor operations.

## Technologies

- Node.js, Express.js, JavaScript
- PostgreSQL, pg
- dotenv, Nodemon
- Zod, ESLint, Prettier

## Setup

bash
npm install


Create a .env file using .env.example, then run:

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

- Routes, controllers, services and repositories.
- Zod request validation.
- Duplicate email prevention.
- Centralized error handling.

## API Endpoints

Base URL: `http://localhost:5000/api/customers`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/customers` | Create customer |
| GET | `/api/customers` | Get all customers |
| GET | `/api/customers/:id` | Get customer by ID |
| PUT | `/api/customers/:id` | Update customer |
| DELETE | `/api/customers/:id` | Delete customer |

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

- CRUD operations.
- Invalid input and malformed JSON.
- Duplicate email addresses.
- Deleted customer retrieval.
- Unauthorized update fields.

Status: Customer API implementation and testing completed.

---

# Task 3 – PostgreSQL Persistence

## Implementation

- Integrated PostgreSQL using the `pg` package and connection pooling.
- Configured database connection through environment variables.
- Created the customers table.
- Replaced in-memory storage with persistent database operations.
- Implemented parameterized SQL queries.
- Updated repository methods for CRUD operations.
- Added database connection error handling.

## Bug Log & Testing

1. Database Connection Failure

- Symptom: API requests failed when the database was unavailable.
- Cause: Database connection was interrupted.
- Fix: Verified connection failure handling and returned a clean error response.
- Lesson: Handle database failures gracefully.

2. SQL Injection

- Symptom: SQL injection input could potentially affect database queries.
- Cause: Unsafe query construction.
- Fix: Used parameterized queries to store input as plain text.
- Lesson: Never concatenate user input into SQL queries.

3. Concurrent Duplicate Emails

- Symptom: Simultaneous requests attempted to create customers with the same email.
- Cause: Application-level duplicate checks alone cannot prevent race conditions.
- Fix: Verified duplicate protection through the database unique constraint and error handling.
- Lesson: Enforce data integrity at the database level.

4. Missing Await

- Symptom: Endpoint returned an error when fetching customers.
- Cause: Repository query Promise was not awaited.
- Fix: Restored `await` before `pool.query()`.
- Lesson: Await asynchronous database operations before accessing their results.

5. Response Field Mapping

- Symptom: Database field names could appear as `created_at` and `updated_at` in API responses.
- Cause: Database and API naming conventions differ.
- Fix: Mapped snake_case database fields to camelCase API fields.
- Lesson: Keep API responses consistent and readable.

## Testing

Verified using Thunder Client:

- Database connection and CRUD operations.
- Database failure handling.
- SQL injection protection.
- Concurrent duplicate email requests.
- Asynchronous repository operations.
- Response field naming.

Status: PostgreSQL integration and bug testing completed.

---

# Research Notes

- Middleware: Runs during the request-response cycle.
- Error Handling: Express error middleware uses `err, req, res, next`.
- Layered Architecture: Separates responsibilities for maintainability.
- dotenv: Loads environment variables.
- Zod: Provides schema-based validation.
- PostgreSQL: Relational database for persistent storage.
- Parameterized Queries: Protect against SQL injection.
- Connection Pooling: Efficiently manages database connections.
- Unique Constraints: Enforce data integrity.
- Mass Assignment: Unrestricted field assignment can expose sensitive properties.

---

# Task 4 – Inventory & API Improvements

## Implementation

- Updated schema.sql and seed.sql.
- Implemented warehouse-level inventory endpoint.
- Added pagination and category filtering.
- Improved validation and error handling.
- Standardized price formatting.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | Get products with filters and pagination |
| GET | `/api/products/:id/inventory` | Get warehouse inventory |

## Bug Log

1. Invalid Pagination
- Symptom: Invalid page and limit values.
- Cause: Missing validation.
- Fix: Added pagination validation and maximum limit.
- Lesson: Validate query parameters.

2. Non-existing Category
- Symptom: No matching products.
- Cause: Category does not exist.
- Fix: Return an empty list (200 OK).
- Lesson: Empty results are not errors.

3. Invalid Inventory Product ID
- Symptom: Invalid product reference.
- Cause: Product does not exist.
- Fix: Added foreign key constraint.
- Lesson: Maintain referential integrity.

4. Inconsistent Price Formatting
- Symptom: Different price formats.
- Cause: Inconsistent response formatting.
- Fix: Standardized price formatting.
- Lesson: Keep API responses consistent.

5. Empty Category Filter
- Symptom: Empty category caused unexpected filtering.
- Cause: Missing empty-value handling.
- Fix: Normalize empty values and skip filtering.
- Lesson: Handle optional parameters.

## Testing

- Pagination and category filtering.
- Invalid inventory references.
- Price formatting.
- Empty category values.
- Warehouse inventory and 404 handling.

Status: Completed.

## Research Notes

- Pagination: Divides records into pages.
- Filtering: Retrieves matching records.
- Foreign Key: Maintains table relationships.
- Referential Integrity: Prevents invalid references.
- Price Formatting: Ensures consistent API responses.

## Project Progress

| Task | Status |
|---|---|
| Task 1 – Project Foundation | Completed |
| Task 2 – Customer API | Completed |
| Task 3 – PostgreSQL Persistence | Completed |
| Task 4 – Inventory & API Improvements | Completed |
