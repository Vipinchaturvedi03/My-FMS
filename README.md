

# FMS Kisan Krishi Management

A comprehensive Farm Management System for Kisan Krishi, designed to streamline crop, labor, expense, stock, and reporting operations for agricultural businesses. This project features a modern frontend built with React and Tailwind CSS, and a robust backend using Node.js and Express, with a PostgreSQL database.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Configuration](#configuration)
- [Database Migration](#database-migration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

FMS Kisan Krishi Management is a full-stack application for managing all aspects of farm operations. It provides modules for crop management, expense tracking, labor management, stock control, and reporting, with user authentication and multi-language support.

---

## Features

- User authentication (register/login)
- Multi-language support (toggle between languages)
- Crop management (add, edit, delete, view crops)
- Expense tracking (record, update, delete expenses)
- Labor management (track labor activities and costs)
- Stock management (inventory control for farm inputs/outputs)
- Reports and analytics (summarized data for decision making)
- Responsive dashboard UI for desktop and mobile

---

## Architecture

- **Frontend:** SPA built with React, styled using Tailwind CSS, bundled with Vite for fast development.
- **Backend:** RESTful API built with Express.js, handling business logic and database operations.
- **Database:** PostgreSQL, with migration scripts for schema management.
- **Authentication:** JWT-based authentication, with protected routes and middleware.
- **Internationalization:** Language context and translation files for UI localization.

---

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, PostCSS
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Other:** JWT, ESLint, Prettier

---

## Project Structure

```
FMS_kisan_krishi_management/
├── backend/
│   ├── db.js                # Database connection setup
│   ├── server.js            # Express server entry point
│   ├── package.json         # Backend dependencies
│   ├── schema.sql           # Main DB schema
│   ├── run-migration.js     # Migration runner script
│   ├── middleware/
│   │   └── auth.js          # Auth middleware
│   ├── migrations/
│   │   └── 001_crop_tables.sql # Migration files
│   └── routes/
│       ├── auth.js          # Auth routes
│       ├── crops.js         # Crop routes
│       ├── expenses.js      # Expense routes
│       ├── labor.js         # Labor routes
│       ├── reports.js       # Reports routes
│       └── stock.js         # Stock routes
├── frontend/
│   ├── index.html           # Main HTML file
│   ├── package.json         # Frontend dependencies
│   ├── postcss.config.js    # PostCSS config
│   ├── tailwind.config.js   # Tailwind config
│   ├── vite.config.js       # Vite config
│   └── src/
│       ├── api.js           # API utility
│       ├── App.jsx          # Main App component
│       ├── index.css        # Global styles
│       ├── main.jsx         # Entry point
│       ├── translations.js  # Language translations
│       ├── components/      # Reusable components
│       ├── context/         # React context providers
│       ├── data/            # Static data
│       └── pages/           # Page components
└── PROJECT_INFO.md          # Project overview
```

---

## Setup Instructions

### Prerequisites

- Node.js (v16+ recommended)
- PostgreSQL

### Backend Setup

1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure your PostgreSQL database connection in `db.js` (set host, user, password, database).
4. Run database migrations:
   ```sh
   node run-migration.js
   ```
5. Start the backend server:
   ```sh
   node server.js
   ```

### Frontend Setup

1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
4. Access the app at [http://localhost:5173](http://localhost:5173)

---

## Configuration

- **Backend:** Set environment variables for database connection and JWT secret in a `.env` file (if supported).
- **Frontend:** Update API base URL in `src/api.js` if backend runs on a different host/port.

---

## Database Migration

- Migration scripts are in `backend/migrations/`.
- Main schema is in `backend/schema.sql`.
- Use `run-migration.js` to apply migrations.

---

## Usage

- Register a new user or login.
- Use the dashboard to manage crops, expenses, labor, stock, and view reports.
- Toggle language using the UI switch.

---

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login

### Crops
- `GET /api/crops` - List crops
- `POST /api/crops` - Add crop
- `PUT /api/crops/:id` - Update crop
- `DELETE /api/crops/:id` - Delete crop

### Expenses
- `GET /api/expenses` - List expenses
- `POST /api/expenses` - Add expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Labor
- `GET /api/labor` - List labor records
- `POST /api/labor` - Add labor record
- `PUT /api/labor/:id` - Update labor record
- `DELETE /api/labor/:id` - Delete labor record

### Stock
- `GET /api/stock` - List stock items
- `POST /api/stock` - Add stock item
- `PUT /api/stock/:id` - Update stock item
- `DELETE /api/stock/:id` - Delete stock item

### Reports
- `GET /api/reports` - Get reports

---

## Testing

- Backend: Add tests using Jest or Mocha in a `tests/` folder.
- Frontend: Add tests using React Testing Library or Jest in `src/__tests__/`.

---

## Deployment

- **Backend:** Deploy using services like Heroku, AWS, or DigitalOcean. Set environment variables for production.
- **Frontend:** Build with `npm run build` and deploy static files to Netlify, Vercel, or similar.

---

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature-xyz`)
3. Commit your changes
4. Push to your branch
5. Create a pull request

---

## License

This project is licensed under the MIT License.
=======
# My-FMS
This is my MERN based project

