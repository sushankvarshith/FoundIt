# FoundIt — Comprehensive Codebase & Project Architecture Guide

Welcome to the complete guide for **FoundIt**! This document is written specifically for you so that you can understand, navigate, and confidently explain every piece of code in this project during presentations, college vivas, or technical interviews.

---

## 1. High-Level Technology Stack & Architecture

FoundIt is built as a complete **3-Tier Full-Stack Web Application**:

```
 ┌────────────────────────────────────────────────────────┐
 │           PRESENTATION TIER (Frontend UI)              │
 │  • HTML5 Structure & Semantic Layout                   │
 │  • Vanilla CSS & Liquid Glass Design System            │
 │  • JavaScript / React & Lucide Icons                   │
 │  • Runs on: http://localhost:3000                      │
 └──────────────────────────┬─────────────────────────────┘
                            │
               HTTP REST API Calls (JSON)
                            │
 ┌──────────────────────────▼─────────────────────────────┐
 │            APPLICATION TIER (Java Backend)             │
 │  • Core Java (Standard JDK 21/25 HttpServer)           │
 │  • Multi-threaded Request Handling (Executor Pool)     │
 │  • Data Access Objects (DAOs) & PreparedStatement SQL  │
 │  • Runs on: http://localhost:8080                      │
 └──────────────────────────┬─────────────────────────────┘
                            │
                   JDBC Protocol (Port 3306)
                            │
 ┌──────────────────────────▼─────────────────────────────┐
 │            DATA TIER (MySQL DBMS / Database)           │
 │  • MySQL / MariaDB (foundit_db)                        │
 │  • Normalized Tables with Foreign Keys & Indexes       │
 │  • Dual-Mode: Automatic In-Memory Fallback if offline  │
 └────────────────────────────────────────────────────────┘
```

---

## 2. How the Components Communicate

1. **User Action in Browser**: When a user creates a lost item post, likes a post, or submits a claim in the frontend UI, JavaScript handles the event.
2. **REST API Request**: The frontend service (`apiClient.ts`) issues an HTTP `POST`, `GET`, or `PUT` request with a JSON payload to `http://localhost:8080/api/...`.
3. **Java HttpServer**: The Java server (`FoundItServer.java`) receives the HTTP request on port 8080, checks CORS headers, and routes the request to the matching Handler class.
4. **DAO & JDBC**: The Handler calls a Data Access Object (e.g. `ItemDao.java`). The DAO prepares a SQL query using a `PreparedStatement` and executes it over JDBC against the MySQL database.
5. **Database Response**: MySQL executes the query, updates the tables, and returns the result to Java.
6. **JSON Response**: Java formats the result as a JSON string and sends it back in the HTTP response body with status code 200/201.
7. **UI Update**: The web page updates dynamically without requiring a full page refresh.

---

## 3. Database Layer (`database/`)

### Schema Overview (`database/schema.sql`)
The database `foundit_db` consists of 6 core relational tables:

| Table Name | Description | Key Fields |
| :--- | :--- | :--- |
| `users` | User accounts, profiles, and reputation badges | `id` (PK), `username`, `email`, `phone`, `reputation_score` |
| `items` | Lost and found reports posted by users | `id` (PK), `type` (lost/found), `title`, `category`, `uploader_id` (FK), `reward_amount` |
| `claims` | "I Think This Is Mine" claim verification forms | `id` (PK), `item_id` (FK), `claimant_id` (FK), `status`, `answers` |
| `comments` | Discussion threads & tips on item posts | `id` (PK), `item_id` (FK), `user_id` (FK), `comment_text` |
| `chat_messages` | Private direct messages between finders and owners | `id` (PK), `conversation_id`, `sender_id` (FK), `receiver_id` (FK) |
| `notifications` | In-app alerts for likes, matches, and claim status | `id` (PK), `user_id` (FK), `type`, `title`, `is_read` |

### Key SQL Queries Used in the Project
- **Insert Post**:
  ```sql
  INSERT INTO items (id, type, title, category, brand, model, color, description, location_name, city, uploader_id)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  ```
- **Filter Posts by Category & Search**:
  ```sql
  SELECT * FROM items WHERE category = ? AND (LOWER(title) LIKE ? OR LOWER(description) LIKE ?)
  ORDER BY created_at DESC;
  ```
- **Update Post Status**:
  ```sql
  UPDATE items SET status = ? WHERE id = ?;
  ```

---

## 4. Java Backend (`backend/src/server/`)

### 1. `FoundItServer.java` (Main Entry Point)
- **Role**: Starts the HTTP server on port 8080 using JDK's built-in `com.sun.net.httpserver.HttpServer`.
- **Why Core Java?**: Does not require heavy external frameworks (like Spring Boot) or complex Maven/Gradle builds. Anyone with standard Java installed can compile and run it in 1 second!
- **Concurrency**: Configures a thread pool (`Executors.newFixedThreadPool(12)`) so multiple users can browse simultaneously without lag.

### 2. `DatabaseManager.java` (Resilient Database Connection)
- **Role**: Establishes the JDBC connection to `jdbc:mysql://localhost:3306/foundit_db`.
- **Automatic Fallback Feature**: If XAMPP MySQL is not running when you start the server, the code does **not** crash. Instead, it logs a gentle notification and switches seamlessly to a thread-safe in-memory cache. Once MySQL is started, it persists data directly to SQL!

### 3. Models (`backend/src/server/models/`)
- Pure Java POJOs (Plain Old Java Objects):
  - `ItemPost.java`: Encapsulates post fields (title, type, category, reward, location, stats).
  - `User.java`: Encapsulates user details, contact preference, and reputation score.
  - `Claim.java`, `Comment.java`, `ChatMessage.java`, `Notification.java`.

### 4. Data Access Objects (`backend/src/server/dao/`)
- `ItemDao.java`: Handles SQL queries for searching, filtering by location, sorting by distance, and toggling likes.
- `UserDao.java`: Handles user authentication and profile updates.
- `ClaimDao.java`: Records claim submissions with private verification answers.

### 5. REST Handlers (`backend/src/server/handlers/`)
- Implement `com.sun.net.httpserver.HttpHandler`.
- `PostsHandler.java`: Responds to `/api/posts` (GET, POST, PUT, DELETE).
- `HealthHandler.java`: Responds to `/api/health` with live diagnostics and database connection status.
- `AuthHandler.java`: Responds to `/api/auth` (login, register, me, profile).

---

## 5. Web Frontend (`src/`)

### Liquid Glass Design Language
The UI uses modern **Glassmorphism / Liquid Glass**:
- **Backdrop Filters**: `backdrop-blur-2xl` makes elements translucent while blurring what is behind them.
- **Layered Glass**: Differentiates surface depths with specular rim borders (`border-cyan-500/25`), delicate gradient highlights (`bg-gradient-to-b from-white/20 to-transparent`), and subtle drop shadows.
- **Color Palette**: Deep cosmic night (`#060c1c`), energetic cyan (`#06b6d4`), and emerald accents (`#10b981`).

### Frontend Services (`src/services/`)
- `apiClient.ts`: Sends fetch requests to `http://localhost:8080/api` with timeouts and fallback protection.
- `itemService.ts`: Synchronizes the feed with Java and MySQL on boot, keeping local storage as a seamless offline fallback.
- `Navbar.tsx`: Features a real-time status pill displaying the live connection to the Java REST API and MySQL database.

---

## 6. How to Run the Project (Step-by-Step)

### Method 1: The 1-Click Way
1. Double-click `start-all.bat`.
2. It will automatically compile the Java server, start the backend on port 8080, start the web frontend on port 3000, and open your browser!

### Method 2: Running Individually in Terminal
**Terminal 1 (Java Backend):**
```bash
start-backend.bat
# Or manually:
javac -cp "backend/lib/mysql-connector-j.jar" -d backend/bin backend/src/server/models/*.java backend/src/server/utils/*.java backend/src/server/db/*.java backend/src/server/dao/*.java backend/src/server/handlers/*.java backend/src/server/FoundItServer.java
java -cp "backend/bin;backend/lib/mysql-connector-j.jar" server.FoundItServer
```

**Terminal 2 (Web Frontend):**
```bash
npm run dev
```

### Setting Up MySQL in XAMPP (Optional for SQL Persistence)
1. Open **XAMPP Control Panel** and click **Start** next to MySQL.
2. Double-click `setup-mysql.bat` (this runs `database/schema.sql` and `database/seed_data.sql`).
3. Refresh the web page — the navbar status badge will now show `MySQL Active`!

---

## 7. Common Viva / Interview Questions & Answers

### Q1: What architecture does this project follow?
> **Answer**: It follows a 3-tier full-stack architecture. The presentation tier is built using HTML5, CSS3, and JavaScript/React. The business logic tier is a multi-threaded Core Java REST API running on JDK HttpServer (port 8080). The persistence tier is a MySQL database (`foundit_db`) accessed via JDBC.

### Q2: Why did you use `PreparedStatement` instead of `Statement` in Java JDBC?
> **Answer**: We use `PreparedStatement` for two main reasons:
> 1. **Security against SQL Injection**: Input parameters are parameterized (`?`), ensuring user inputs are treated as literal data rather than executable SQL commands.
> 2. **Performance**: PreparedStatement is pre-compiled by the database engine, allowing faster repeated executions with different parameters.

### Q3: What is CORS and how did you resolve it in Java?
> **Answer**: CORS (Cross-Origin Resource Sharing) is a browser security mechanism that restricts web pages from requesting resources from a different origin (different port or domain). Since the frontend runs on port 3000 and the Java backend runs on port 8080, our `CorsHelper.java` attaches `Access-Control-Allow-Origin: *` and handles HTTP `OPTIONS` preflight requests so the browser allows data exchange.

### Q4: How is user privacy protected in FoundIt?
> **Answer**: Public posts display only approximate locations (e.g. neighborhood/city) rather than exact residential coordinates. Contact information (phone numbers/emails) is hidden from public view; users communicate through safe in-app chat or submit verification claims where only the owner can review proof of ownership.

### Q5: What happens if the MySQL server is temporarily down?
> **Answer**: Our `DatabaseManager` implements a resilient dual-mode architecture. If MySQL is unreachable, it logs a diagnostic message and gracefully switches to a thread-safe in-memory cache. The user never experiences crashes or white screens, and all UI features continue to work smoothly.
