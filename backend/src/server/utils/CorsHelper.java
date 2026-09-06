package server.utils;

import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;

/**
 * CORS Helper Utility
 * Cross-Origin Resource Sharing (CORS) allows the web browser running the
 * React frontend on http://localhost:3000 (or other ports) to make HTTP requests
 * to this Java backend running on http://localhost:8080.
 */
public class CorsHelper {

    public static void applyCorsHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept");
        exchange.getResponseHeaders().set("Access-Control-Max-Age", "86400");
    }

    public static boolean handlePreflight(HttpExchange exchange) throws IOException {
        applyCorsHeaders(exchange);
        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.sendResponseHeaders(204, -1);
            exchange.close();
            return true;
        }
        return false;
    }
}
