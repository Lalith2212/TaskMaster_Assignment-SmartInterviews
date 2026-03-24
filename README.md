# TaskMaster — Full Stack Task Management System

A production-ready Task Management application built with React, Node.js, and MongoDB. Designed with a focus on professional aesthetics, clarity, and robust technical implementation.

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, React Router v6, Recharts |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB + Mongoose                |
| Auth       | JWT (JSON Web Tokens) + bcryptjs  |
| Styling    | Custom CSS                        |

---

## Features

- **Authentication**: JWT-based secure signup and login with bcrypt password hashing.
- **Task Management**: Full CRUD operations for personal tasks.
- **Detailed Task Fields**: Title, Description, Status (To Do, In Progress, Done), Priority (Low, Medium, High), and Due Date.
- **Filtering & Search**: Dynamic filtering by status/priority and real-time search by title.
- **Analytics Dashboard**: Visual insights including total tasks, completion percentage, and breakdown charts (Recharts).
- **Productivity Tools**: Pagination, sorting (date/priority), and overdue task detection.
- **User Interface**: Clean, professional light/dark modes with a fully responsive layout.
- **Reliability**: Global error handling middleware and structured API validation.

---

## Project Structure

```
taskmaster/
├── backend/
│   ├── controllers/      # Route logic (Auth, Tasks, Analytics)
│   ├── middleware/       # JWT protection & global error handler
│   ├── models/           # Mongoose schemas (User, Task)
│   ├── routes/           # Express route definitions
│   └── server.js         # Entry point & DB connection
└── frontend/
    ├── src/
    │   ├── api/          # Axios service layer & interceptors
    │   ├── components/   # Reusable UI elements (Layout, Modals)
    │   ├── context/      # Global Authentication State
    │   └── pages/        # Main application views
```

---

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### 1. Backend Setup
1. Navigate to the `backend` directory.
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`.
4. Run the server: `npm run dev`

### 2. Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`
3. Run the application: `npm start`

The application will be available at `http://localhost:3000`.

---

## API Endpoints

### Authentication
- `POST /api/auth/register` — Register a new account.
- `POST /api/auth/login` — Sign in and receive a JWT.
- `GET /api/auth/me` — Retrieve current user profile.

### Task Management
- `GET /api/tasks` — List all tasks (supports search, filter, sort, and pagination).
- `POST /api/tasks` — Create a new task.
- `PUT /api/tasks/:id` — Update an existing task.
- `DELETE /api/tasks/:id` — Permenantly remove a task.

---

## Design Decisions

1. **Professional Aesthetic**: Removed all informal elements (emojis, flashy animations) to ensure a stable, production-ready feel suitable for enterprise use.
2. **MongoDB Aggregation**: Used `$group` and `$match` pipelines for the Analytics dashboard to ensure high performance even with large datasets.
3. **Database Indexing**: Implemented compound indexes on the Task model (`user_id + status`, `user_id + priority`) to optimize query performance.
4. **Inter-Service Communication**: Implemented Axios interceptors to automatically attach JWT headers and handle 401 Unauthorized responses globally.
5. **Neutral Palette**: Utilized a modern, neutral design system (Inter font, slate/gray accents) to prioritize readability and user focus.
