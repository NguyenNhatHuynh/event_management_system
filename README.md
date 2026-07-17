# Event Management System (MERN Stack)

Welcome to the **Event Management System** documentation! This application is a full-stack web platform designed to manage events efficiently, built using the MERN stack (MongoDB, Express, React, Node.js). It provides a seamless experience for both clients and admins with a modern, responsive UI. Below is a detailed guide on how to set up and run the application.

---

## Overview

The **Event Management System** is a full-stack application developed using the **MERN stack**. It offers a user-friendly interface for clients to explore events, book events, and contact organizers, while admins can manage events, users, blogs, and analytics through a dedicated dashboard. The application supports features like pagination, role-based authentication, and real-time notifications.

## System Requirements
- **Node.js** version 14 or above
- **npm** version 6 or above
- **MongoDB** (Local or MongoDB Atlas)
- **Text Editor or IDE** (e.g., VS Code)
- **Git**
- **Postman** (Optional, for API testing)

## Technologies Used
- **React.js** (Frontend framework)
- **Node.js** (Backend runtime, version 14 or above)
- **Express.js** (Backend framework)
- **MongoDB** (Database, with Mongoose for ORM)
- **React Bootstrap** (for Styling)
- **Axios** (for API requests)
- **React Toastify** (for real-time notifications)
- **Quill Editor** (for blog post editing)

## Features Include (Client Side)
- **User Account Management** (Sign up, log in, update profile)
- **Event Exploration** (View event types and details)
- **Event Booking** (Book events directly on the platform)
- **Blog Section** (Read news and updates)
- **Contact Form** (Send inquiries to organizers)
- **Pagination** (For events and blogs)
- **Fully Mobile-Responsive Design**

## Features Include (Admin Dashboard)
- **Event Management** (Create, update, delete events)
- **Event Type Management** (Add and edit event categories)
- **User Management** (View and manage users)
- **Blog Management** (Create, edit, delete blog posts)
- **Contact Management** (View and delete inquiries)
- **Analytics Dashboard** (View event and booking statistics)
- **System Settings** (Update site info like name, email, phone, logo)
- **Dark and Light Theme** (Modern UI with theme toggle)
- **Fully Mobile-Responsive Design**

---

## Server Setup

### Environment Variables
First, create the environment variables file `.env` in the `backend` folder. The `.env` file should contain the following variables:

- `PORT` = `5000` or any port number
- `MONGODB_URI` = `your MongoDB connection URL`
- `JWT_SECRET` = `your secret key for JWT - must be secured`

Example `.env` file:
- MONGODB_URL = `your MongoDB URL`
- JWT_SECRET_KEY = `any secret key - must be secured`
- PORT = `5000` or any port number
- AUTH_EMAIL = `your email address to send the OTP`
- AUTH_PASSWORD = `password to your email account` (used Hotmail for email verification)

### Set Up MongoDB
1. Setting up MongoDB involves a few steps:
    - Visit the MongoDB Atlas Website: [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
    - Create an Account or Log in to your MongoDB Atlas account
    - Create a New Cluster
    - Choose a Cloud Provider and Region
    - Configure Cluster Settings
    - Create Cluster and wait for it to deploy
    - Create a Database User
    - Set Up IP Whitelist (Allow access from your IP or everywhere for testing)
    - Connect to Cluster and copy the connection URL
    - Configure your application by adding the URL to the `.env` file
    - Test the Connection using MongoDB Compass or your application

2. Create a new database (e.g., `event_management`) and configure the `.env` file with the MongoDB connection URL.

### Steps to Run Server
1. Open the project in your editor of choice.
2. Navigate into the server directory: `cd backend`.
3. Run `npm i` to install the packages.
4. Run `npm start` to start the server.

If configured correctly, you should see a message indicating that the server is running successfully and `Connected to MongoDB`.

---

## Client Side Setup

### Environment Variables
No environment variables are required for the client side in this project. However, ensure the backend API URL (`http://localhost:5000`) is accessible from the frontend.

### Steps to Run Client
1. Navigate into the client directory: `cd frontend`.
2. Run `npm i` to install the packages.
3. Run `npm start` to run the app on `http://localhost:3000`.
4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

---

## Admin Dashboard Setup
The admin dashboard is integrated into the same frontend application as the client side, accessible via the `/admin` route after logging in with admin credentials.

### Environment Variables
No additional environment variables are required for the admin dashboard.

### Steps to Access Admin Dashboard
1. Ensure the frontend is running (`npm start` in the `frontend` folder).
2. Log in with admin credentials:
   - Email: `admin@example.com`
   - Password: `admin123`
3. Navigate to `/admin` (e.g., `http://localhost:3000/admin`) to access the dashboard.

---

## Security Note

### Environment Variables
- Safeguard your environment variables by storing them securely and not exposing them unintentionally.
- Ensure that only authorized personnel have access to the environment variable configurations (e.g., do not commit the `.env` file to GitHub).

### Database Security
- Use strong credentials for MongoDB users.
- Restrict IP access in MongoDB Atlas to trusted sources.

### For Support, Contact
- **Email**: `<xoandev163.com>` (e.g., xoandev163@gmail.com)
- **GitHub**: `https://github.com/<NguyenNhatHuynh>`

(Status Project : Done Version 1)
