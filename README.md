# Blogging Application

A full-stack blogging application built with Node.js and Express.js, providing user authentication and authorization, CRUD operations for blogs, and file uploads.

---

## Features

1. **User Authentication and Authorization**
   - User registration and login.
   - Password change functionality.
   - Secured routes using `authMiddleware`.

2. **Blog Management**
   - Create, read, update, and delete blogs.
   - Retrieve a specific blog by ID.
   - Retrieve all blogs (restricted to authenticated users).

3. **File Upload**
   - Support for file uploads using `express-fileupload`.

4. **Error Handling**
   - Centralized error handling middleware for better debugging and response.

Install Dependencies
bash
Copy
Edit
npm install
Create a .env File
Create a .env file in the config directory and define the following environment variables:

env
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
Start the Server
bash
Copy
Edit
npm start
API Endpoints
User Routes
Method	Endpoint	Description	Middleware
POST	/auth/user/register	Register a new user	None
POST	/auth/user/login	Login a user	None
PUT	/auth/user/update	Update user details	authMiddleware
POST	/auth/user/change-password	Change user password	authMiddleware
Blog Routes
Method	Endpoint	Description	Middleware
POST	/auth/blog/save-blog	Create a new blog	authMiddleware
GET	/auth/blog/get/:id	Get a blog by ID	None
PUT	/auth/blog/update-blog/:id	Update a blog by ID	authMiddleware
DELETE	/auth/blog/delete-blog/:id	Delete a blog by ID	authMiddleware
GET	/auth/blog/all-blog	Get all blogs	authMiddleware
Middleware
Global Middleware
errorMiddleware: Handles errors globally and sends appropriate responses.
Route-Specific Middleware
authMiddleware: Protects routes by verifying JSON Web Tokens (JWT).
---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vijay-tech-colab/blogging-app.git
