package server;

import com.sun.net.httpserver.HttpServer;
import server.db.DatabaseManager;
import server.handlers.*;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.concurrent.Executors;

/**
 * ============================================================================
 * FoundIt Server - Core Java REST API Entry Point
 * ============================================================================
 * Tech Stack: Core Java (JDK 21/25 HttpServer), JDBC, MySQL DBMS, REST API
 * 
 * Features:
 * - Pure Core Java: No Maven/Gradle or external frameworks required!
 * - Multi-threaded: Uses an Executor pool for concurrent HTTP requests.
 * - Dual-Mode Persistence: Connects to MySQL on localhost:3306 or falls back
 *   to thread-safe in-memory cache if MySQL server is not running.
 * - Complete CORS support for seamless communication with the React frontend.
 */
public class FoundItServer {

    private static final int PORT =Integer.parseInt(System.getenv().getOrDefault("PORT", "8080"));

    public static void main(String[] args) {
        System.out.println("--------------------------------------------------");
        System.out.println("       Starting FoundIt Java REST Backend         ");
        System.out.println("--------------------------------------------------");

        // 1. Initialize Database / In-Memory layer
        DatabaseManager db = DatabaseManager.getInstance();

        // 2. Create JDK HTTP Server
        try {
                HttpServer server = HttpServer.create(new InetSocketAddress("0.0.0.0", PORT), 0);
            // 3. Register REST API Endpoints
            server.createContext("/api/health", new HealthHandler());
            server.createContext("/api/posts", new PostsHandler());
            server.createContext("/api/auth", new AuthHandler());
            server.createContext("/api/claims", new ClaimsHandler());
            server.createContext("/api/comments", new CommentsHandler());
            server.createContext("/api/chats", new ChatsHandler());
            server.createContext("/api/notifications", new NotificationsHandler());

            // 4. Configure Thread Pool for concurrency
            server.setExecutor(Executors.newFixedThreadPool(12));

            // 5. Start Server
            server.start();

            System.out.println("--------------------------------------------------");
            System.out.println(" \u2705 FoundIt Java Backend is LIVE and listening!");
            System.out.println(" \uD83D\uDD17 Health Check:  http://localhost:" + PORT + "/api/health");
            System.out.println(" \uD83D\uDD17 Posts API:     http://localhost:" + PORT + "/api/posts");
            System.out.println(" \uD83D\uDD17 Auth API:      http://localhost:" + PORT + "/api/auth");
            System.out.println(" \uD83D\uDCCA Storage Mode:  " + (db.isUsingMySQL() ? "MySQL (Connected)" : "In-Memory Fallback"));
            System.out.println("--------------------------------------------------");
            System.out.println(" Press Ctrl+C in this console to stop the server.");

        } catch (IOException e) {
            System.err.println("Failed to start HTTP server on port " + PORT + ": " + e.getMessage());
            e.printStackTrace();
        }
    }
}
