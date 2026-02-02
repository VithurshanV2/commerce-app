# Commerce Web Application

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![.NET](https://img.shields.io/badge/.NET-512BD4?style=for-the-badge&logo=.net&logoColor=white)
![SQL Server](https://img.shields.io/badge/SQL_Server-CC2927?style=for-the-badge&logo=microsoft-sql-server&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

A full-stack commerce web application with JWT authentication, Google OAuth integration, and role-based access control for Admin and User roles.

## Default Admin Credentials

The application comes with a pre-seeded admin account:
- **Email:** admin@test.com
- **Password:** admin123

Login at `http://localhost:5173/login` to access the admin dashboard.

## Installation

### Prerequisites
- Node.js (v18 or higher)
- .NET 8 SDK
- SQL Server or SQL Server LocalDB
- Google OAuth Client ID

### Setup Instructions

1. Clone the repository
```bash
git clone https://github.com/VithurshanV2/commerce-app.git
cd commerce-app
```

2. Backend Setup

Navigate to server directory:
```bash
cd server
```

Install dependencies:
```bash
dotnet restore
```

Configure user secrets:
```bash
dotnet user-secrets init
dotnet user-secrets set "Jwt:Key" "your-secret-key-minimum-32-characters-long"
dotnet user-secrets set "Google:ClientId" "your-google-client-id"
```

Run database migrations:
```bash
dotnet ef database update
```

Run the backend:
```bash
dotnet run
```

Backend will run on `https://localhost:7XXX` (check console output)

3. Frontend Setup

Navigate to client directory:
```bash
cd client
```

Install dependencies:
```bash
npm install
```

Configure environment variables:

Create `.env` file in client directory:
```env
VITE_API_URL=https://localhost:7XXX
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

Run the frontend:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

### Getting Google OAuth Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project → Enable Google+ API → Create OAuth Client ID
3. Add authorized origin: `http://localhost:5173`
4. Copy the Client ID

## API Usage

### Authentication Endpoints

**Register User**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "roleId": 2
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "message": "Registration successful",
  "user": { "id": 1, "name": "John Doe", "email": "john@example.com", "role": "User" }
}
```

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Google Login**
```http
POST /api/auth/google-login
Content-Type: application/json

{
  "googleToken": "google-jwt-token"
}
```

### Items Endpoints (Protected)

**Get All Items**
```http
GET /api/items
Authorization: Bearer <jwt-token>
```

**Get Item by ID**
```http
GET /api/items/{id}
Authorization: Bearer <jwt-token>
```

**Create Item (Admin Only)**
```http
POST /api/items
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "Laptop",
  "price": 999.99,
  "quantity": 10
}
```

**Update Item (Admin Only)**
```http
PUT /api/items/{id}
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "Updated Laptop",
  "price": 899.99,
  "quantity": 15
}
```

**Delete Item (Admin Only)**
```http
DELETE /api/items/{id}
Authorization: Bearer <jwt-token>
```

### Default Roles

- **Admin** (RoleId: 1) - Full CRUD access to items
- **User** (RoleId: 2) - Read-only access to items

### Creating Additional Admin Users

**Using Postman:**
```http
POST http://localhost:<PORT>/api/auth/register
Content-Type: application/json

{
  "name": "Admin2",
  "email": "admin2@test.com",
  "password": "password123",
  "roleId": 1
}
```

**Using PowerShell:**
```powershell
Invoke-WebRequest -Uri "http://localhost:<PORT>/api/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"name":"Admin2","email":"admin2@test.com","password":"password123","roleId":1}'
```

Replace `<PORT>` with your backend port (check console output when running `dotnet run`).
