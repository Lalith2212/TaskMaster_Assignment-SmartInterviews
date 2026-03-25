# TaskMaster

A full-stack task management application with JWT authentication, real-time analytics, and a clean responsive UI.

**Live App:** [https://task-master-assignment-smart-interv.vercel.app/login](https://task-master-assignment-smart-interv.vercel.app)

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, React Router v6, Recharts |
| Backend   | Node.js, Express.js                 |
| Database  | MongoDB + Mongoose                  |
| Auth      | JWT + bcryptjs                      |
| Hosting   | Vercel (Frontend), Render (Backend) |

---

## Features

- JWT-based authentication (register, login, protected routes)
- Full CRUD for tasks — title, description, status, priority, due date
- Filter by status/priority, search by title, sort and paginate
- Analytics dashboard with completion percentage, pie and bar charts
- Overdue task detection
- Light/Dark mode toggle
- Fully responsive layout

---

## Project Structure

```
taskmaster/
├── backend/
│   ├── controllers/        # Auth, Tasks, Analytics logic
│   ├── middleware/         # JWT protection, error handler
│   ├── models/             # Mongoose schemas (User, Task)
│   ├── routes/             # Express route definitions
│   └── server.js           # Entry point
└── frontend/
    └── src/
        ├── api/            # Fetch-based service layer
        ├── components/     # Layout, TaskModal
        ├── context/        # Auth context (global state)
        └── pages/          # Login, Register, Dashboard, Tasks
```

---

## Setup Instructions

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)

### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

Start the server:

```bash
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
```

Create a `.env` file:

```
REACT_APP_API_URL=http://localhost:5000/api
```

Start the app:

```bash
npm start
```

App runs at `http://localhost:3000`

---

## API Endpoints

### Authentication

| Method | Endpoint             | Description              | Access  |
|--------|----------------------|--------------------------|---------|
| POST   | /api/auth/register   | Register a new account   | Public  |
| POST   | /api/auth/login      | Login and receive JWT    | Public  |
| GET    | /api/auth/me         | Get current user profile | Private |

### Tasks

| Method | Endpoint         | Description                                    | Access  |
|--------|------------------|------------------------------------------------|---------|
| GET    | /api/tasks       | Get all tasks (filter, search, sort, paginate) | Private |
| POST   | /api/tasks       | Create a new task                              | Private |
| GET    | /api/tasks/:id   | Get a single task                              | Private |
| PUT    | /api/tasks/:id   | Update a task                                  | Private |
| DELETE | /api/tasks/:id   | Delete a task                                  | Private |

### Analytics

| Method | Endpoint       | Description                        | Access  |
|--------|----------------|------------------------------------|---------|
| GET    | /api/analytics | Get task stats for logged-in user  | Private |

---

## Design Decisions

1. **MongoDB Aggregation** — Used `$group` and `$match` pipelines for analytics to keep it performant at scale.
2. **Compound Indexing** — Indexes on `user + status` and `user + priority` for fast filtered queries.
3. **Native Fetch** — Custom fetch wrapper instead of third-party HTTP libraries, keeping the bundle lean.
4. **Global Auth State** — React Context manages user session with localStorage persistence.
5. **Global Error Handling** — Express middleware catches all errors centrally, with specific handling for Mongoose validation, duplicate keys, and invalid ObjectIds.
6. **Neutral Design** — Inter font, slate/gray palette — focused on readability over decoration.

---

## Deployment

### Frontend (Vercel)

Set environment variable in Vercel dashboard:

```
REACT_APP_API_URL = https://taskmaster-assignment-smartinterviews.onrender.com/api
```

### Backend (Render)

Set environment variables in Render dashboard:

```
MONGODB_URI = your_atlas_connection_string
JWT_SECRET  = your_secret
CLIENT_URL  =https://task-master-assignment-smart-interv.vercel.app/login
```