# Finance Data Processing and Access Control Backend

Backend assessment project built with Node.js, Express, MongoDB Atlas, JWT, and role-based access control.

## Tech Stack

- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT authentication
- Role-based access control (viewer, analyst, admin)
- express-validator for input validation

## Features Implemented

### 1. User and Role Management

- Admin can create, list, update, and delete users
- Roles supported: `viewer`, `analyst`, `admin`
- User status supported: `active`, `inactive`
- Inactive users are blocked from authenticated access

### 2. Financial Records Management

- Record fields: amount, type (income/expense), category, date, notes, createdBy
- CRUD endpoints for records
- Filtering by type, category, date range, amount range
- Pagination support for listing

### 3. Dashboard Summary APIs

- Total income
- Total expenses
- Net balance
- Category-wise totals
- Monthly trend aggregation
- Recent activity (latest 5 records)

### 4. Access Control Logic (RBAC)

- Viewer: read records + dashboard summary
- Analyst: read records + dashboard summary
- Admin: full access to users and records

### 5. Validation and Error Handling

- Input validation on request payloads and query params
- Proper HTTP status codes (400, 401, 403, 404, 409, 500)
- Consistent error JSON responses

### 6. Data Persistence

- MongoDB Atlas using Mongoose schemas and indexes

## Project Structure

```text
src/
	app.js
	server.js
	config/
		db.js
		env.js
	controllers/
		authController.js
		dashboardController.js
		recordController.js
		userController.js
	middleware/
		auth.js
		errorHandler.js
		rbac.js
		validate.js
	models/
		Record.js
		User.js
	routes/
		authRoutes.js
		dashboardRoutes.js
		index.js
		recordRoutes.js
		userRoutes.js
	seed/
		seedData.js
```

## Environment Variables

Copy `.env.example` to `.env` and provide values:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<db-name>?retryWrites=true&w=majority
JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRES_IN=1d
NODE_ENV=development
```

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Configure `.env` with MongoDB Atlas URI and JWT secret.

3. Seed sample data:

```bash
npm run seed
```

4. Start server:

```bash
npm run dev
```

Base URL: `http://localhost:5000/api`

## API Documentation

- Swagger UI: `http://localhost:5000/api/docs`
- OpenAPI JSON: `http://localhost:5000/api/docs.json`

## Seeded Demo Credentials

- Admin: `admin@zorvyn.com` / `Admin@123`
- Analyst: `analyst@zorvyn.com` / `Analyst@123`
- Viewer: `viewer@zorvyn.com` / `Viewer@123`
- Inactive Viewer: `inactive@zorvyn.com` / `Inactive@123` (blocked)

## API Overview

### Health

- `GET /api/health`

### Auth

- `POST /api/auth/login`
- `GET /api/auth/me` (authenticated)

### Users (Admin only)

- `POST /api/users`
- `GET /api/users?role=&status=&page=&limit=`
- `GET /api/users/:id`
- `PATCH /api/users/:id`
- `DELETE /api/users/:id`

### Records

- `GET /api/records` (viewer/analyst/admin)
- `GET /api/records/:id` (viewer/analyst/admin)
- `POST /api/records` (admin)
- `PATCH /api/records/:id` (admin)
- `DELETE /api/records/:id` (admin)

Supported filters on list endpoint:

- `type=income|expense`
- `category=...`
- `startDate=YYYY-MM-DD`
- `endDate=YYYY-MM-DD`
- `minAmount=...`
- `maxAmount=...`
- `page=...`
- `limit=...`

### Dashboard

- `GET /api/dashboard/summary` (viewer/analyst/admin)

## Example Login Request

```bash
curl --request POST \
	--url http://localhost:5000/api/auth/login \
	--header 'Content-Type: application/json' \
	--data '{
		"email": "admin@zorvyn.com",
		"password": "Admin@123"
	}'
```

Use returned token in `Authorization` header:

```text
Authorization: Bearer <JWT_TOKEN>
```

## Assumptions and Tradeoffs

- Authentication endpoint implemented as login-only to keep scope focused.
- Record ownership restrictions are not enforced per-user; access is role-driven.
- Hard delete is used for users/records for simplicity.
- No refresh token flow included.

## Optional Enhancements (Not Yet Implemented)

- Unit/integration tests
- Swagger/OpenAPI documentation
- Soft delete with audit logs
- Rate limiting
- Refresh tokens and token revocation strategy
