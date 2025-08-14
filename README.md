# Subscription Manager

A full-stack web application for managing user subscriptions with Angular frontend and Node.js backend.

## Tech Stack

- **Frontend**: Angular 17 with Bootstrap 5
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Authentication**: JWT-based login
- **Logging**: Winston
- **Testing**: Jest (Backend), Jasmine/Karma (Frontend)

## Features

- User authentication (Login/Register) with JWT
- CRUD operations for subscriptions
- Filterable subscription tables
- Dashboard with statistics
- Form validation for all inputs
- Responsive design with Bootstrap
- Error handling and logging
- Route protection with auth guards

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## Setup Instructions

### 1. Database Setup

1. Install PostgreSQL and create a database:
```sql
CREATE DATABASE subscription_manager;
```

2. Run the database schema:
```bash
cd backend
psql -U postgres -d subscription_manager -f database/schema.sql
```

3. Update database credentials in `backend/.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=subscription_manager
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
```

### 2. Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create logs directory:
```bash
mkdir logs
```

4. Start the backend server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The backend will run on `http://localhost:3000`

### 3. Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the Angular development server:
```bash
npm start
```

The frontend will run on `http://localhost:4200`

## Default Login Credentials

Use these credentials to login (from sample data):

- **Email**: admin@example.com
- **Password**: password (default bcrypt hash in schema.sql)

Or register a new account through the registration form.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Subscriptions (Protected)
- `GET /api/subscriptions` - Get all subscriptions (with filters)
- `GET /api/subscriptions/:id` - Get subscription by ID
- `POST /api/subscriptions` - Create new subscription
- `PUT /api/subscriptions/:id` - Update subscription
- `DELETE /api/subscriptions/:id` - Delete subscription

### Users (Protected)
- `GET /api/users/profile` - Get current user profile

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Project Structure

```
subscription-manager/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Authentication middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── utils/           # Utilities (logger)
│   ├── tests/           # Jest tests
│   ├── database/        # Database schema
│   └── server.js        # Main server file
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/  # Angular components
│   │   │   ├── services/    # Angular services
│   │   │   ├── guards/      # Route guards
│   │   │   ├── models/      # TypeScript interfaces
│   │   │   └── ...
│   │   └── ...
└── README.md
```

## Development Notes

- The backend uses Winston for logging - check `logs/` directory for log files
- JWT tokens expire after 24 hours
- Form validation is implemented on both frontend and backend
- All API routes except auth are protected with JWT middleware
- Bootstrap 5 is used for responsive UI components

## Troubleshooting

1. **Database Connection Issues**: Verify PostgreSQL is running and credentials in `.env` are correct
2. **CORS Issues**: Backend is configured to allow all origins in development
3. **Port Conflicts**: Backend runs on port 3000, frontend on 4200 - change in respective config files if needed
4. **JWT Issues**: Check that JWT_SECRET is set in backend `.env` file

## License

This project is for educational purposes.