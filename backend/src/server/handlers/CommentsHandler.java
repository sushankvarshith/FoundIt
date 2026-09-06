package server.handlers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import server.dao.CommentDao;
import server.models.Comment;
import server.utils.CorsHelper;
import server.utils.JsonHelper;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * CommentsHandler - Endpoint: /api/comments
 * Handles fetching, adding, and liking comments on posts.
 */
public class CommentsHandler implements HttpHandler {

    private final CommentDao commentDao = new CommentDao();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (CorsHelper.handlePreflight(exchange)) return;
        CorsHelper.applyCorsHeaders(exchange);

        String method = exchange.getRequestMethod().toUpperCase();
        String path = exchange.getRequestURI().getPath();
        String query = exchange.getRequestURI().getRawQuery();

        try {
            if ("GET".equals(method)) {
                String itemId = null;
                if (query != null && query.contains("itemId=")) {
                    for (String part : query.split("&")) {
                        if (part.startsWith("itemId=")) {
                            itemId = part.substring("itemId=".length());
                        }
                    }
                }
                List<Comment> comments = commentDao.getCommentsByItem(itemId != null ? itemId : "post_1");
                sendResponse(exchange, 200, JsonHelper.commentsToJson(comments));
            } else if ("POST".equals(method)) {
                if (path.endsWith("/like")) {
                    String sub = path.substring("/api/comments/".length());
                    String commentId = sub.substring(0, sub.indexOf("/like"));
                    boolean ok = commentDao.toggleLike(commentId);
                    sendResponse(exchange, 200, String.format("{\"success\":%b}", ok));
                    return;
                }

                String body = readBody(exchange);
                Comment c = new Comment();
                c.setItemId(JsonHelper.getString(body, "itemId", ""));
                c.setUserId(JsonHelper.getString(body, "userId", "usr_me"));
                c.setUserName(JsonHelper.getString(body, "userName", "Arjun Rao"));
                c.setUserAvatar(JsonHelper.getString(body, "userAvatar", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"));
                c.setText(JsonHelper.getString(body, "text", ""));
                c.setCreatedAt("Just now");

                Comment created = commentDao.addComment(c);
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
