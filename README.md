# Distributor Order Management API

A RESTful API built with Node.js and Express.js for managing distributor operations.

# Technologies

- Node.js, Express.js, JavaScript
- PostgreSQL, pg
- dotenv, Nodemon
- Zod, ESLint, Prettier
- JWT, bcrypt

# Setup

```bash
npm install
```

Create a `.env` file using `.env.example`, then run:

```bash
npm run dev
```

---

# Task 1 – Project Foundation

## Implementation

- Set up the Express application and project structure.
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
- Fix: Restricted updates to permitted customer fields.
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

---

# Task 5 – Authentication & Authorization

## Implementation

Implemented JWT-based authentication and role-based authorization to secure the API.

- Created a users table to store user accounts.
- Added user registration and login functionality.
- Used bcrypt to hash passwords before storing them in PostgreSQL.
- Verified passwords during login using bcrypt comparison.
- Implemented JWT access token generation.
- Added authentication middleware to verify incoming tokens.
- Added role-based authorization middleware.
- Restricted protected routes according to user roles.
- Prevented users from assigning themselves privileged roles during registration.
- Kept passwords and password hashes out of API responses.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate user and generate JWT |

## Users Table

The users table stores information about people who can access the system.

| Field | Description |
|---|---|
| id | Unique user identifier |
| email | User's login email |
| password_hash | Hashed password |
| role | User's assigned role |
| customer_id | Optional customer association |
| created_at | Account creation timestamp |
| updated_at | Last update timestamp |

## JWT Token Flow

1. User Registration

- A user registers with an email and password.
- The password is hashed using bcrypt.
- The hashed password is stored in the users table.
- The server assigns the default DISTRIBUTOR role.
- Users cannot become ADMIN by sending a role field in the registration request.

2. User Login

- The user submits their email and password.
- The server searches for the user by email.
- bcrypt compares the submitted password with the stored password hash.
- If the credentials are valid, the server generates a JWT access token.

3. Token Generation

The JWT contains the following information:

- `userId`: Unique ID of the user.
- `role`: Assigned user role.
- `iat`: Time when the token was issued.
- `exp`: Token expiration time.

The token is signed using the JWT secret stored in environment variables.

4. Accessing Protected Routes

The client sends the token in the Authorization header:

```http
Authorization: Bearer <access_token>
```

The authentication middleware:

- Extracts the token from the Authorization header.
- Verifies the token signature.
- Checks whether the token has expired.
- Attaches the decoded user information to the request.
- Allows the request to continue if authentication succeeds.

5. Role-Based Authorization

After authentication, the authorization middleware checks the user's role.

- ADMIN: Can access admin-protected routes.
- DISTRIBUTOR: Cannot access admin-only routes.

If a distributor attempts to access an admin-only endpoint, the server responds with `403 Forbidden`.

## Bug Log & Security Testing

1. Unauthorized Access to Admin Routes

- Symptom: A distributor could potentially access routes reserved for administrators.
- Cause: Authentication alone does not check whether a user has permission to access a route.
- Fix: Implemented role-based authorization middleware to restrict admin-only endpoints.
- Testing: Logged in as a distributor and attempted to access an admin-only customer route.
- Result: Server returned `403 Forbidden`.
- Lesson: Authentication verifies identity, while authorization controls permissions.

2. Self-Registration as ADMIN

- Symptom: A user could attempt to register with `"role": "ADMIN"` in the request body.
- Cause: Trusting client-provided roles could allow privilege escalation.
- Fix: The server assigns the default `DISTRIBUTOR` role instead of accepting the role from the registration request.
- Testing: Registered a user with `"role": "ADMIN"` in the request body.
- Result: The account was created with the `DISTRIBUTOR` role.
- Lesson: Sensitive permissions must be controlled by the server, not the client.

3. Password and Password Hash Exposure

- Symptom: Passwords or password hashes could accidentally appear in API responses or application logs.
- Cause: Returning complete user records or logging sensitive information can expose credentials.
- Fix: Checked registration and login responses to ensure password-related fields were not returned. Also inspected application logging statements for sensitive information.
- Testing: Checked registration responses, login responses and server logs.
- Result: Password and password hash were not visible in the inspected responses or logs.
- Lesson: Never expose passwords or password hashes through API responses or logs.

4. User Enumeration Through Login Errors

- Symptom: Different login errors could reveal whether an email address exists in the system.
- Cause: Returning different error messages for unknown emails and incorrect passwords.
- Fix: Used the same `401 Unauthorized` response and error message for both cases.
- Testing:
  - Existing email with an incorrect password.
  - Unknown email with an incorrect password.
- Result: Both requests returned `401 Unauthorized` with `Invalid email or password`.
- Lesson: Generic login errors help prevent attackers from identifying registered users.

5. JWT Token Expiration

- Symptom: Protected API requests returned `401 Unauthorized` because the token expired before the request was made.
- Cause: The initial JWT expiration was configured to only five seconds.
- Fix: Increased the token validity to fifteen minutes.
- Testing: Generated a new token and immediately accessed a protected admin-only route as a distributor.
- Result: The token was accepted, but the distributor received `403 Forbidden` when accessing the admin-only route.
- Lesson: Token expiration should balance security and usability.

## Authentication and Authorization Testing

Tested using Thunder Client:

- User registration and login.
- Password verification using bcrypt.
- JWT token generation and validation.
- Accessing protected routes with a valid token.
- Accessing admin-only routes as a distributor.
- Attempting to register with an ADMIN role.
- Checking API responses for password exposure.
- Comparing wrong-password and unknown-email login errors.
- Testing expired JWT tokens.

Status: Authentication, authorization and the major security tests completed.

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
- bcrypt: Hashes passwords before storing them.
- JWT: Provides a signed token for identifying authenticated users.
- Authentication: Verifies who is making a request.
- Authorization: Determines what an authenticated user is allowed to do.
- Role-Based Access Control: Restricts access based on assigned user roles.
- Bearer Token: Sends an access token through the Authorization header.
- User Enumeration: Occurs when login responses reveal whether an account exists.
- Token Expiration: Limits how long an access token remains valid.

---

# Project Progress

| Task | Status |
|---|---|
| Task 1 – Project Foundation | Completed |
| Task 2 – Customer API | Completed |
| Task 3 – PostgreSQL Persistence | Completed |
| Task 4 – Inventory & API Improvements | Completed |
| Task 5 – Authentication & Authorization | Completed |