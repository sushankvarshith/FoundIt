package server.handlers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import server.db.DatabaseManager;
import server.utils.CorsHelper;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

/**
 * HealthHandler - Endpoint: GET /api/health
 * Returns JSON status reporting backend health, Java version, and whether MySQL is connected.
 */
public class HealthHandler implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (CorsHelper.handlePreflight(exchange)) return;
        CorsHelper.applyCorsHeaders(exchange);

        DatabaseManager db = DatabaseManager.getInstance();
        boolean isMySQL = db.isUsingMySQL();
        String storageMode = isMySQL ? "MySQL Database (localhost:3306 / foundit_db)" : "Resilient In-Memory Mode (Start XAMPP MySQL to persist to SQL)";

        int itemsCount = db.isUsingMySQL() ? db.getMemoryItems().size() : db.getMemoryItems().size();
        int usersCount = db.getMemoryUsers().size();

        String json = String.format(
            "{\"status\":\"UP\",\"service\":\"FoundIt Core Java API\",\"javaVersion\":\"%s\"," +
            "\"mysqlConnected\":%b,\"storageMode\":\"%s\",\"itemsCount\":%d,\"usersCount\":%d}",
            System.getProperty("java.version"), isMySQL, storageMode, itemsCount, usersCount
        );

        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        exchange.sendResponseHeaders(200, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }
}
