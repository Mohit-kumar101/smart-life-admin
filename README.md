# Smart Life Admin Assistant

A full-stack task management app with smart prioritization, analytics, and an AI assistant.

> **Portfolio note:** This repo is the source code. Clone and run locally (see below). It does not include a hosted live demo.

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Backend    | Spring Boot 3.2 (Java 17)         |
| Database   | MongoDB                           |
| Frontend   | React 18 + Vite                   |
| Charting   | Recharts                          |
| Styling    | Custom CSS (design tokens)        |

---

## Features

- **Smart Priority Engine** — calculates a 0–100 score per task based on overdue status, time-to-due, and category
- **Task CRUD** — create, update, delete, complete with real-time UI updates
- **Filters & Sorting** — all / pending / completed / overdue + sort by priority / due date / created
- **Analytics Dashboard** — workload gauge, completion rate, category pie, priority distribution
- **AI Assistant** — context-aware chat with task data; mock mode by default, real OpenAI optional
- **Auth** — register/login with BCrypt password hashing
- **Toast notifications**, empty states, loading states

---

## Project Structure

```
smart-life-admin/
├── backend/                          # Spring Boot
│   └── src/main/java/com/smartlife/
│       ├── model/          # User, Task (with enums)
│       ├── dto/            # Request/Response DTOs
│       ├── repository/     # MongoRepository interfaces
│       ├── service/        # Business logic
│       │   ├── UserService
│       │   ├── TaskService
│       │   ├── TaskPriorityService   ← Smart engine
│       │   ├── AnalyticsService
│       │   └── AiAssistantService
│       ├── controller/     # REST controllers
│       ├── config/         # Security, CORS, Mongo indexes
│       └── exception/      # Global error handler
│
└── frontend/                         # React + Vite
    └── src/
        ├── context/        # AuthContext
        ├── services/       # api.js (centralized axios)
        ├── hooks/          # useTasks, useAnalytics
        ├── utils/          # helpers.js
        ├── components/
        │   ├── layout/     # Sidebar, Header, AppLayout
        │   ├── ui/         # Card, Button, Badge, Modal, Input, StatCard, Spinner
        │   ├── tasks/      # TaskCard, TaskFormModal
        │   └── analytics/  # WorkloadGauge
        └── pages/
            ├── AuthPage
            ├── DashboardPage
            ├── TasksPage
            ├── AnalyticsPage
            └── AiAssistantPage
```

---

## Getting Started

### Prerequisites

- Java 17+
- Maven 3.9+
- MongoDB running on `localhost:27017`
- Node.js 18+

---

### 1. Start MongoDB

```bash
mongod --dbpath /data/db
# Or with Docker:
docker run -d -p 27017:27017 --name mongo mongo:7
```

---

### 2. Run the Backend

```bash
cd backend
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`

**Optional:** Set your OpenAI API key for real AI responses:
```bash
export OPENAI_API_KEY=sk-...
# Then in application.properties:
# app.ai.enabled=true
```

---

### 3. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## API Reference

### Auth
| Method | Endpoint             | Description     |
|--------|----------------------|-----------------|
| POST   | /api/auth/register   | Register user   |
| POST   | /api/auth/login      | Login           |
| GET    | /api/auth/user/{id}  | Get user info   |

### Tasks
| Method | Endpoint                       | Description          |
|--------|--------------------------------|----------------------|
| POST   | /api/tasks                     | Create task          |
| GET    | /api/tasks/{userId}            | Get all user tasks   |
| PUT    | /api/tasks/{taskId}            | Update task          |
| DELETE | /api/tasks/{taskId}            | Delete task          |
| PATCH  | /api/tasks/complete/{taskId}   | Mark as complete     |

### Analytics
| Method | Endpoint               | Description        |
|--------|------------------------|--------------------|
| GET    | /api/analytics/{userId}| Get analytics data |

### AI Assistant
| Method | Endpoint        | Description              |
|--------|-----------------|--------------------------|
| POST   | /api/ai/suggest | Ask the AI assistant     |

---

## Priority Score Algorithm

```
Score (0–100) = CategoryScore + TimeScore

CategoryScore:
  URGENT    → 40
  IMPORTANT → 25
  NORMAL    → 10
  OPTIONAL  →  0

TimeScore:
  Overdue          → 20–40 (scales with how overdue)
  Due within 24hrs → 20
  Due within 3 days→ 15
  Due within 7 days→  8
  Due 7+ days away →  2

Completed tasks always score 0.
```

---

## Workload Score Algorithm

```
Workload = (overdue × 3 + urgentPending × 2 + pending × 1) / 60 × 100

Labels:
  0–24  → Low (green)
  25–49 → Moderate (indigo)
  50–74 → High (amber)
  75–100→ Critical (red)
```

---

## Environment Variables

Copy `.env.example` for optional overrides. Backend defaults are in `backend/src/main/resources/application.properties`.

| Variable          | Default               | Description                |
|-------------------|-----------------------|----------------------------|
| OPENAI_API_KEY    | (unset)               | For real AI responses      |
| MONGODB_URI       | mongodb://localhost:27017/smartlife_db | MongoDB connection |

---

## Push to GitHub

```bash
# From project root (first time only)
git init
git add .
git commit -m "Initial commit: Smart Life Admin full-stack app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/smart-life-admin.git
git push -u origin main
```

Create an empty repo on GitHub first (no README), then replace `YOUR_USERNAME` in the remote URL.

---

## Production Build

```bash
# Frontend
cd frontend
npm run build
# Output in frontend/dist/

# Backend
cd backend
mvn clean package
java -jar target/smart-life-admin-1.0.0.jar
```
