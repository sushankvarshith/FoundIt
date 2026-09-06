package server.handlers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import server.dao.NotificationDao;
import server.models.Notification;
import server.utils.CorsHelper;
import server.utils.JsonHelper;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * NotificationsHandler - Endpoint: /api/notifications
 * Handles alerts, likes/comments notifications, and mark-as-read.
 */
public class NotificationsHandler implements HttpHandler {

    private final NotificationDao notifDao = new NotificationDao();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (CorsHelper.handlePreflight(exchange)) return;
        CorsHelper.applyCorsHeaders(exchange);

        String method = exchange.getRequestMethod().toUpperCase();
        String path = exchange.getRequestURI().getPath();

        try {
            if ("GET".equals(method)) {
                List<Notification> notifs = notifDao.getNotificationsForUser("usr_me");
                sendResponse(exchange, 200, JsonHelper.notificationsToJson(notifs));
            } else if ("PUT".equals(method)) {
                if (path.endsWith("/read-all")) {
                    notifDao.markAllAsRead("usr_me");
                    sendResponse(exchange, 200, "{\"success\":true}");
                } else if (path.endsWith("/read")) {
                    String sub = path.substring("/api/notifications/".length());
                    String notifId = sub.substring(0, sub.indexOf("/read"));
                    notifDao.markAsRead(notifId);
                    sendResponse(exchange, 200, "{\"success\":true}");
                } else {
                    sendResponse(exchange, 400, "{\"error\":\"Invalid endpoint\"}");
                }
            } else {
                sendResponse(exchange, 404, "{\"error\":\"Not found\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            sendResponse(exchange, 500, "{\"error\":\"" + JsonHelper.escape(e.getMessage()) + "\"}");
        }
    }

    private void sendResponse(HttpExchange exchange, int statusCode, String responseJson) throws IOException {
        byte[] bytes = responseJson.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }
}
