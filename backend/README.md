# WaiterHub Backend

This is the backend API for WaiterHub, built with Node.js, Express, and Prisma ORM. It provides RESTful endpoints for authentication, user management, orders, products, and restaurants.

## Prerequisites

- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env` and update values as needed.

3. **Start the services with Docker Compose:**

   ```bash
   docker-compose up --build
   ```

4. **Apply database migrations:**
   Open a new terminal and run:

   ```bash
   docker exec -it waiterhub_api sh
   npx prisma migrate dev
   ```

   This will apply the latest Prisma migrations to the database.

5. **Optional**
   Open a terminal and run:

   ```bash
   npx prisma generate
   ```

   This is not neccesary for run the project, but if you want to see the code without typescript errors so is neccesary

## Development

- The backend will be available at `http://localhost:8080` (or the port specified in your `.env`).
- Prisma Studio (database browser) is available and set up automatically with Docker on the port `http://localhost:5555`
