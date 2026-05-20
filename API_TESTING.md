# 🧪 API Testing Guide for Ethara

## Quick API Testing

You can test the API using:
1. **Postman** - Visual API testing tool
2. **cURL** - Command line
3. **Thunder Client** - VS Code extension
4. **REST Client** - VS Code extension

## Base URL

Local: `http://localhost:5000`
Production: `https://your-railway-url`

---

## Authentication Endpoints

### 1. Sign Up

**Endpoint:** `POST /api/auth/signup`

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Test@123",
    "confirmPassword": "Test@123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Member"
  }
}
```

---

### 2. Login

**Endpoint:** `POST /api/auth/login`

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Test@123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Member"
  }
}
```

---

### 3. Get Current User

**Endpoint:** `GET /api/auth/me`

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Member",
    "avatar": null
  }
}
```

---

## Project Endpoints

### 1. Create Project

**Endpoint:** `POST /api/projects`

```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Website Redesign",
    "description": "Complete redesign of company website",
    "dueDate": "2024-12-31"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Project created successfully",
  "project": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Website Redesign",
    "description": "Complete redesign of company website",
    "owner": { /* User object */ },
    "members": [ /* Member objects */ ],
    "status": "Active",
    "dueDate": "2024-12-31",
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

---

### 2. Get All Projects

**Endpoint:** `GET /api/projects`

```bash
curl -X GET http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "success": true,
  "projects": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Website Redesign",
      "description": "...",
      "owner": { /* User */ },
      "members": [ /* Members */ ],
      "status": "Active",
      "dueDate": "2024-12-31"
    }
  ]
}
```

---

### 3. Get Project by ID

**Endpoint:** `GET /api/projects/:id`

```bash
curl -X GET http://localhost:5000/api/projects/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 4. Update Project

**Endpoint:** `PUT /api/projects/:id`

```bash
curl -X PUT http://localhost:5000/api/projects/507f1f77bcf86cd799439012 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Website Redesign 2024",
    "status": "In Progress",
    "dueDate": "2024-12-15"
  }'
```

---

### 5. Delete Project

**Endpoint:** `DELETE /api/projects/:id`

```bash
curl -X DELETE http://localhost:5000/api/projects/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 6. Add Member to Project

**Endpoint:** `POST /api/projects/:id/members`

```bash
curl -X POST http://localhost:5000/api/projects/507f1f77bcf86cd799439012/members \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "email": "colleague@example.com",
    "role": "Member"
  }'
```

---

## Task Endpoints

### 1. Create Task

**Endpoint:** `POST /api/tasks`

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Design Homepage",
    "description": "Create mockups for homepage redesign",
    "projectId": "507f1f77bcf86cd799439012",
    "assignedTo": "507f1f77bcf86cd799439011",
    "priority": "High",
    "dueDate": "2024-12-20"
  }'
```

---

### 2. Get Tasks

**Endpoint:** `GET /api/tasks`

With filters:
```bash
curl -X GET "http://localhost:5000/api/tasks?projectId=507f1f77bcf86cd799439012&status=Todo&priority=High" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 3. Get Task by ID

**Endpoint:** `GET /api/tasks/:id`

```bash
curl -X GET http://localhost:5000/api/tasks/507f1f77bcf86cd799439013 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 4. Update Task

**Endpoint:** `PUT /api/tasks/:id`

```bash
curl -X PUT http://localhost:5000/api/tasks/507f1f77bcf86cd799439013 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "status": "In Progress",
    "priority": "Medium"
  }'
```

---

### 5. Delete Task

**Endpoint:** `DELETE /api/tasks/:id`

```bash
curl -X DELETE http://localhost:5000/api/tasks/507f1f77bcf86cd799439013 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 6. Get Project Statistics

**Endpoint:** `GET /api/tasks/project/:projectId/stats`

```bash
curl -X GET http://localhost:5000/api/tasks/project/507f1f77bcf86cd799439012/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "total": 10,
    "completed": 3,
    "inProgress": 2,
    "todo": 4,
    "onHold": 1,
    "overdue": 1
  }
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access token required" or "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Project not found" or "Task not found"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

---

## Postman Collection

Save this as `ethara.postman_collection.json`:

```json
{
  "info": {
    "name": "Ethara API",
    "description": "Project Management API",
    "version": "1.0.0"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Signup",
          "request": {
            "method": "POST",
            "header": ["Content-Type: application/json"],
            "url": "{{base_url}}/api/auth/signup",
            "body": {
              "raw": "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"Test@123\",\"confirmPassword\":\"Test@123\"}"
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": ["Content-Type: application/json"],
            "url": "{{base_url}}/api/auth/login",
            "body": {
              "raw": "{\"email\":\"john@example.com\",\"password\":\"Test@123\"}"
            }
          }
        },
        {
          "name": "Get Current User",
          "request": {
            "method": "GET",
            "header": ["Authorization: Bearer {{token}}"],
            "url": "{{base_url}}/api/auth/me"
          }
        }
      ]
    },
    {
      "name": "Projects",
      "item": [
        {
          "name": "Create Project",
          "request": {
            "method": "POST",
            "header": ["Content-Type: application/json", "Authorization: Bearer {{token}}"],
            "url": "{{base_url}}/api/projects",
            "body": {
              "raw": "{\"name\":\"Website Redesign\",\"description\":\"...\",\"dueDate\":\"2024-12-31\"}"
            }
          }
        },
        {
          "name": "Get Projects",
          "request": {
            "method": "GET",
            "header": ["Authorization: Bearer {{token}}"],
            "url": "{{base_url}}/api/projects"
          }
        }
      ]
    }
  ],
  "variable": [
    {"name": "base_url", "value": "http://localhost:5000"},
    {"name": "token", "value": ""}
  ]
}
```

---

## Testing Workflow

1. **Start Backend**: `npm run dev` (in backend folder)
2. **Sign Up**: Get a token
3. **Create Project**: Use token, save project ID
4. **Create Task**: Use project ID, save task ID
5. **Update Task**: Use task ID
6. **Add Member**: Use project ID
7. **Get Stats**: Use project ID

---

## Common Issues

### Token Errors
- Ensure Bearer prefix: `Authorization: Bearer token_here`
- Token might be expired (7 days)
- Check JWT_SECRET is same on backend

### CORS Errors
- Ensure backend is running
- Check FRONTEND_URL in backend .env
- Verify Content-Type header

### Database Errors
- Verify MongoDB is running
- Check MONGODB_URI in .env
- Ensure MongoDB credentials are correct

---

**Happy API Testing! 🚀**
