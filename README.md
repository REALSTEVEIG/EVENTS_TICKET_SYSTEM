# **Event Ticket Booking System**

A comprehensive and scalable event ticket booking system built with **Node.js**, **Express**, and **PostgreSQL**. This project features concurrency-safe operations, JWT-based authentication, rate-limiting, and well-documented API endpoints.

## **Table of Contents**
- [Overview](#overview)
- [Key Features](#key-features)
- [Design Choices](#design-choices)
- [Project Setup](#project-setup)
- [API Documentation](#api-documentation)
- [Rate Limiting](#rate-limiting)
- [Authentication](#authentication)
- [Tests](#tests)

---

## **Overview**

The Event Ticket Booking System is designed to handle high-concurrency ticket bookings with the following features:
- Users can book tickets for events.
- When tickets sell out, users are automatically placed on a waiting list.
- If a booking is canceled, the system automatically reassigns the ticket to the next user on the waiting list.
- Built with scalability, concurrency handling, and real-world scenarios in mind, this system ensures that race conditions and edge cases are managed effectively.
- The system uses **PostgreSQL** for relational data storage and Sequelize as the ORM, ensuring data integrity.

---

## **Key Features**
- **Concurrency-Safe Ticket Booking:** Handles simultaneous booking requests without overselling tickets.
- **Waiting List Management:** Automatically assigns tickets to users on the waiting list when a cancellation occurs.
- **Comprehensive Error Handling:** Provides meaningful error messages and manages edge cases effectively.
- **JWT Authentication:** Secures API endpoints with JSON Web Tokens.
- **Rate Limiting:** Protects the API from excessive requests per user/IP.
- **Test-Driven Development (TDD):** Includes unit and integration tests for key functionalities.

---

## **Design Choices**

Building this project required balancing simplicity, scalability, and performance. Here are some key design choices made during development:

### 1. **Concurrency Handling**
Managing race conditions and concurrent booking operations was a top priority. To ensure thread-safety, I used **Sequelize transactions**. The use of `transaction.LOCK.UPDATE` prevents overselling tickets by ensuring that only one operation can modify ticket availability at a time.

### 2. **Database Design**
The system relies on **PostgreSQL** to manage event data, bookings, and waiting lists. This allows for powerful relational queries and ensures data consistency. Additionally, using **Sequelize ORM** made it easy to model relationships and handle migrations.

### 3. **JWT Authentication**
JWT is used to secure sensitive API routes (like booking and cancellations). I chose JWT for its simplicity in stateless authentication, making the API scalable and easy to integrate with other services.

### 4. **Rate Limiting**
Since the API could be open to public access or face high traffic, implementing **express-rate-limit** helps to prevent abuse and ensures that the system can handle traffic without being overwhelmed.

### 5. **Test-Driven Development (TDD)**
I adopted a **TDD approach**, writing tests for core functionalities before implementing them. This ensured that each feature was thoroughly tested, and the system could handle real-world edge cases.

---

## **Project Setup**

### **Prerequisites**
Before setting up the project, ensure you have the following installed:
- **Node.js** (>= 14.x)
- **PostgreSQL** (>= 12.x)

### **Step-by-Step Setup**

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/event-ticket-booking.git
   cd event-ticket-booking
   ```

2. **Install Dependencies**
   After navigating to the project directory, install the required Node.js packages:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Set up a `.env` file at the root of the project with your environment variables:
   ```bash
   DATABASE_URL=your_postgres_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=3000
   ```

4. **Run Database Migrations**
   Migrate the database to create the necessary tables (events, bookings, waiting lists):
   ```bash
   npx sequelize-cli db:migrate
   ```

5. **Start the Server**
   Run the application using:
   ```bash
   npm start
   ```

   The server will start on `http://localhost:3000`.

---

## **API Documentation**

### **1. Initialize Event**

#### Endpoint
```http
POST /initialize
```

#### Request Body:
```json
{
  "eventId": 1,
  "totalTickets": 100
}
```

#### Response:
```json
{
  "message": "Event initialized",
  "event": {
    "eventId": 1,
    "totalTickets": 100,
    "availableTickets": 100
  }
}
```

---

### **2. Book Ticket**

#### Endpoint
```http
POST /book
```

#### Headers:
- `Authorization: Bearer <JWT_TOKEN>`

#### Request Body:
```json
{
  "eventId": 1,
  "userId": "user1"
}
```

#### Response:
- If ticket is available:
```json
{
  "message": "Ticket booked"
}
```
- If tickets are sold out:
```json
{
  "message": "Added to waiting list"
}
```

---

### **3. Cancel Ticket**

#### Endpoint
```http
POST /cancel
```

#### Headers:
- `Authorization: Bearer <JWT_TOKEN>`

#### Request Body:
```json
{
  "eventId": 1,
  "userId": "user1"
}
```

#### Response:
```json
{
  "message": "Booking canceled"
}
```

---

### **4. Get Event Status**

#### Endpoint
```http
GET /status/:eventId
```

#### Response:
```json
{
  "eventId": 1,
  "availableTickets": 50,
  "waitingListCount": 2
}
```

---

## **Rate Limiting**

This API has a rate limiter applied globally to prevent abuse and denial of service (DoS) attacks. Users are limited to **100 requests per 15 minutes**.

If a user exceeds this limit, they will receive the following error message:
```json
{
  "message": "Too many requests from this IP, please try again later."
}
```

---

## **Authentication**

The API uses **JWT-based authentication** for secured routes like booking and canceling tickets.

### **How to Authenticate:**
1. Use the `/login` endpoint to generate a JWT token.
2. Include the token in the `Authorization` header as follows:
   ```
   Authorization: Bearer <JWT_TOKEN>
   ```

---

## **Tests**

### **Running Unit and Integration Tests**
To ensure the correctness of the system, unit and integration tests have been included using **Jest** and **Supertest**.

#### Run All Tests:
```bash
npm test
```

Tests cover the following:
- Event initialization
- Ticket booking and cancellation
- Waiting list management
- API responses and error handling

### **Test Coverage**
All critical functionalities (booking, cancellation, waiting list) are covered with both unit and integration tests to ensure proper functionality.

---

## **Final Thoughts**

The **Event Ticket Booking System** was designed to demonstrate real-world scenarios in ticket booking operations, ensuring that concurrency issues are handled gracefully. The use of JWT authentication and rate limiting ensures that the system remains secure and performant under heavy loads.