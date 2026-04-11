#  Finance Data Processing and Access Control Backend

A scalable backend system built using **Node.js, Express, TypeScript, and MongoDB** to manage financial records, user roles, and dashboard insights.

---

##  Features

* Authentication & Authorization (JWT-based)
* Role-Based Access Control (Admin, Analyst, Viewer)
*  Financial Records Management (CRUD)
*  Dashboard Summary APIs (Aggregations)
*  Filtering, Sorting, Pagination & Search
*  Centralized Error Handling

---

##  Tech Stack

* Node.js
* Express.js
* TypeScript
* MongoDB (Mongoose)
* JWT Authentication
* bcrypt (Password Hashing)

---

##  Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/kuldeepsrit/BackendApp
cd backend
```

---

### 2. Install Dependencies

```bash
npm install express
npm install mongoose
npm install dotenv
npm install cors
npm install body-parser

npm install jsonwebtoken
npm install bcryptjs
npm install cookie-parser
npm install helmet
npm install express-rate-limit

npm install axios

npm install uuid
npm install --save-dev nodemon
```



### 3. Create Environment File

Create a `.env` file in root:

```env
PORT=8000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
BASE_PATH=/api
```

---

### 4. Run Server

```bash
npm run dev
```

Server will run on:

```
http://localhost:8000/api
```

---

##  Authentication Flow

1. Register user
2. Login to get JWT token
3. Use token in protected APIs

### Header Format:

```
Authorization: Bearer <your_token>
```

---

##  Roles & Permissions

| Role    | Access                                         |
| ------- | ---------------------------------------------- |
| Admin   | Full access (users + transactions + dashboard) |
| Analyst | View transactions + dashboard insights         |
| Viewer  | View dashboard only                            |

---

##  API Endpoints

---

### 🔹 Auth APIs

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | Register new user |
| POST   | `/api/auth/login`    | Login user        |

---

###  User Management (Admin Only)

| Method | Endpoint                     | Description         |
| ------ | ---------------------------- | ------------------- |
| GET    | `/api/auth/users`            | Get all users       |
| PUT    | `/api/auth/users/:id/role`   | Update role         |
| PUT    | `/api/auth/users/:id/status` | Activate/Deactivate |
| DELETE | `/api/auth/users/:id`        | Delete user         |

---

###  Transaction APIs

| Method | Endpoint                |
| ------ | ----------------------- |
| POST   | `/api/transactions`     |
| GET    | `/api/transactions`     |
| PUT    | `/api/transactions/:id` |
| DELETE | `/api/transactions/:id` |

#### Query Support:

* Filter: `type`, `category`
* Date Range: `startDate`, `endDate`
* Pagination: `page`, `limit`
* Sorting: `sortBy`, `order`
* Search: `search`

---

### Dashboard APIs

| Endpoint                          | Description                    |
| --------------------------------- | ------------------------------ |
| `/api/dashboard/summary`          | Total income, expense, balance |
| `/api/dashboard/category-summary` | Category-wise totals           |
| `/api/dashboard/recent`           | Last 5 transactions            |
| `/api/dashboard/monthly-trends`   | Monthly insights               |

---

## Example Request

### Create Transaction

```json
{
  "amount": 500,
  "type": "expense",
  "category": "food",
  "date": "2026-04-10",
  "notes": "Lunch"
}
```

---

##  Assumptions

* Users must login to access protected APIs
* Role-based access strictly enforced
* Default role = `viewer` if not provided
* Dates are expected in ISO format
* Pagination defaults: page=1, limit=10

---

## Tradeoffs

* Simplicity over complexity (no refresh tokens)
* Basic validation instead of full schema validation library
* No frontend included (API-focused design)
* MongoDB aggregation used for performance (instead of multiple queries)

---

##  Error Handling

* Centralized error handler
* Custom error classes (AppError, BadRequest, etc.)
* Consistent response format

---

##  Future Improvements

* Refresh token mechanism
* Rate limiting
* API documentation using Swagger
* Unit & integration testing
* Docker support

---

##  Author

Kuldeep Mishra

---

##  Notes

This project demonstrates backend design skills including:

* API structuring
* Authentication & Authorization
* Clean architecture
* Scalable query handling

---
