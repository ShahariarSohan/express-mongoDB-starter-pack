# Multi-Tenant Organization Workspace API

## Project Overview

The **Multi-Tenant Organization Workspace API** is a secure, scalable REST API designed to support multiple client organizations within a single platform.  
Each organization operates in **strict isolation**, with its own users, projects, and tasks, ensuring enterprise-grade data security and authorization.

This system follows **real-world SaaS architecture principles**, including role-based access control (RBAC), service-layer authorization, and database-level integrity enforcement.

---

## Live API URL (Hosted)

**Base URL:** [https://multi-tenant-organization-workspace-iota.vercel.app](https://multi-tenant-organization-workspace-iota.vercel.app)

> ⚠️ All APIs in the Postman collection are configured using this hosted URL.  
> No localhost setup is required for testing.

---

## Tech Stack

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Zod Validation
- Bcrypt
---

## Why PostgreSQL?

PostgreSQL was chosen because:

- Strong **relational integrity** using foreign keys and constraints
- Excellent support for **multi-tenant relational data**
- ACID compliance ensures **data consistency**
- Scales well for real-world SaaS platforms
- Prisma provides **type-safe queries** and migration control

Given strict rules such as:
- Tasks cannot cross organizations
- Users belong to exactly one organization
- Projects belong to one organization

A relational database is the **most professional and reliable choice**.

---

## Roles & Access Model

### Platform Admin
- Can create organizations
- Can view all organizations
- Does not belong to any organization
- Cannot access projects or tasks

### Organization Admin
- Belongs to exactly one organization
- Can manage users within their organization
- Can manage projects and tasks

### Organization Member
- Belongs to exactly one organization
- Can access only assigned tasks
- Cannot manage users, projects, or organizations

---

## Core Data Models

### User
- id
- name
- email (unique)
- password (hashed)
- role
- organizationId (nullable for Platform Admin)

### Organization
- id
- name
- users
- projects

### Project
- id
- name
- organizationId
- tasks

### Task
- id
- title
- description
- status
- projectId
- assignedToId

---

## Authentication & Authorization

- JWT-based authentication
- Access token required for protected routes
- Authorization enforced at **service layer**
- Cross-organization access is strictly blocked
- Database-level integrity is enforced via foreign keys

---

## API Modules & Endpoints

### Authentication

| Method | Endpoint | Description |
|------|--------|-------------|
| POST | /api/auth/login | Login user |
| POST | /api/auth/logout | Logout user |
| GET | /api/auth/me | Get current user profile |

---

### Organization (Platform Admin Only)

| Method | Endpoint | Description |
|------|--------|-------------|
| POST | /api/organizations | Create organization |
| GET | /api/organizations | Get all organizations |
| POST | /api/users/org-admin | Create organization admin |
---

### Users

#### Organization Admin Access

| Method | Endpoint | Description |
|------|--------|-------------|
| POST | /api/users/org-member | Create organization member |
| GET | /api/users/org-member | Get members of own organization |
| PATCH | /api/users/org-member/:memberId | Update member name |
| DELETE | /api/users/org-member/:memberId | Delete member |

---

### Projects (Organization Admin Only)

| Method | Endpoint | Description |
|------|--------|-------------|
| POST | /api/projects | Create project |
| GET | /api/projects/my-organization | Get organization projects |
| PATCH | /api/projects/:projectId| Update project |
| DELETE | /api/projects/:projectId| Delete project |

---

### Tasks

#### Organization Admin
- Can manage all tasks within their organization

#### Organization Member
- Can access only assigned tasks

| Method | Endpoint | Description |
|------|--------|-------------|
| POST | /api/tasks | Create task |
| GET | /api/tasks/assigned-tasks | Org Admin: my org tasks |
| GET | /api/tasks/my-tasks | Member: assigned tasks |
| PATCH | /api/tasks/:taskId | Update task |
| DELETE | /api/tasks/:taskId | Delete task |

---

## Validation & Error Handling

- Zod is used for request validation
- Centralized global error handler
- Meaningful HTTP status codes
- Sensitive fields (passwords) never returned

---

## ER Diagram

An ER diagram is included showing:
- Tables,Relationships,PrimaryKey,ForeignKey
  
- [ER Diagram](./ER_Diagram.png)

---

## Test Credentials

### Platform Admin
Email: platformadmin@gmail.com
Password: platformadmin


### Organization Admin
Email: orgadmin1@org.com
Password: orgadmin1


### Organization Member
Email: orgmember1@org.com
Password: orgmember1


---

## Postman Collection


### Included
- Hosted API URL
- Authentication already configured
- Headers and tokens pre-filled
- Ready to test immediately after import

📬 Postman Usage Notes

This project includes a fully configured Postman Collection that is ready to use immediately after import.
No additional setup, environment variables, or manual token configuration is required.

✅ How to Use the Postman Collection

- Download the provided Postman Collection JSON file
- Open Postman
- Click Import
- Import the JSON file
- All requests will be available in organized folders

📎 Files:
- 👉 [Test Endpoints In Postman](https://shahariarsohan.postman.co/workspace/Shahariar-Sohan's-Workspace~e9944265-e715-442a-8eb7-30fe6aa38c65/collection/45506624-4f5e1c26-3402-4dc5-b284-08da17fb6833?action=share&source=copy-link&creator=45506624)

- [Import it by downloading or copying it](./Multi-Tenant-Api.postman_collection.json)

---

## Folder Structure
```
src/
├─ app/
│ ├─ config/
│ ├─ modules/
│ │ ├─ auth/
│ │ ├─ organization/
│ │ ├─ user/
│ │ ├─ project/
│ │ ├─ task/
│ ├─ middlewares/
│ ├─ errorHelpers/
│ ├─ shared/
│ └─ utils/
├─ prisma/schema/
└─ app.ts
└─ server.ts
```


---

## Production Readiness

- Prisma singleton used for serverless environments
- Database integrity enforced
- Authorization logic handled outside routes
- Clean separation of concerns

---

## Final Notes

This project demonstrates:
- Multi-tenant SaaS architecture
- Secure RBAC implementation
- Clean backend structure
- Production-ready deployment

