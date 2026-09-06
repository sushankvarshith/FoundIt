package server.handlers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import server.dao.ChatDao;
import server.models.ChatMessage;
import server.utils.CorsHelper;
import server.utils.JsonHelper;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * ChatsHandler - Endpoint: /api/chats
 * Handles sending and retrieving direct chat messages.
 */
public class ChatsHandler implements HttpHandler {

    private final ChatDao chatDao = new ChatDao();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (CorsHelper.handlePreflight(exchange)) return;
        CorsHelper.applyCorsHeaders(exchange);

        String method = exchange.getRequestMethod().toUpperCase();
        String query = exchange.getRequestURI().getRawQuery();

        try {
            if ("GET".equals(method)) {
                String convId = null;
                if (query != null && query.contains("conversationId=")) {
                    for (String part : query.split("&")) {
                        if (part.startsWith("conversationId=")) {
                            convId = part.substring("conversationId=".length());
                        }
                    }
                }
                List<ChatMessage> list = convId != null ? chatDao.getMessages(convId) : chatDao.getAllMessages();
                sendResponse(exchange, 200, JsonHelper.chatMessagesToJson(list));
            } else if ("POST".equals(method)) {
                String body = readBody(exchange);
                ChatMessage msg = new ChatMessage();
                msg.setConversationId(JsonHelper.getString(body, "conversationId", "conv_general"));
                msg.setSenderId(JsonHelper.getString(body, "senderId", "usr_me"));
                msg.setReceiverId(JsonHelper.getString(body, "receiverId", "usr_1"));
                msg.setItemId(JsonHelper.getString(body, "itemId", ""));
                msg.setText(JsonHelper.getString(body, "text", ""));
                msg.setSentAt(new java.text.SimpleDateFormat("hh:mm a").format(new java.util.Date()));
                msg.setRead(true);

                ChatMessage created = chatDao.sendMessage(msg);
                sendResponse(exchange, 201, JsonHelper.toJson(created));
            } else {
                sendResponse(exchange, 404, "{\"error\":\"Not found\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            sendResponse(exchange, 500, "{\"error\":\"" + JsonHelper.escape(e.getMessage()) + "\"}");
        }
    }

    private String readBody(HttpExchange exchange) throws IOException {
        try (BufferedReader br = new BufferedReader(new InputStreamReader(exchange.getRequestBody(), StandardCharsets.UTF_8))) {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) {
                sb.append(line);
            }
            return sb.toString();
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
