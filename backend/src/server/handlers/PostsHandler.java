package server.handlers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import server.dao.ItemDao;
import server.models.ItemPost;
import server.utils.CorsHelper;
import server.utils.JsonHelper;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * PostsHandler - Endpoint: /api/posts
 * Handles full CRUD operations for Lost & Found posts.
 */
public class PostsHandler implements HttpHandler {

    private final ItemDao itemDao = new ItemDao();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (CorsHelper.handlePreflight(exchange)) return;
        CorsHelper.applyCorsHeaders(exchange);

        String method = exchange.getRequestMethod().toUpperCase();
        URI uri = exchange.getRequestURI();
        String path = uri.getPath(); // e.g. "/api/posts" or "/api/posts/post_1" or "/api/posts/post_1/like"

        try {
            if ("GET".equals(method)) {
                handleGet(exchange, uri, path);
            } else if ("POST".equals(method)) {
                handlePost(exchange, path);
            } else if ("PUT".equals(method)) {
                handlePut(exchange, path);
            } else if ("DELETE".equals(method)) {
                handleDelete(exchange, path);
            } else {
                sendResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            sendResponse(exchange, 500, "{\"error\":\"Internal server error: " + JsonHelper.escape(e.getMessage()) + "\"}");
        }
    }

    private void handleGet(HttpExchange exchange, URI uri, String path) throws IOException {
        String subPath = path.substring("/api/posts".length());
        if (subPath.startsWith("/")) subPath = subPath.substring(1);

        if (!subPath.isEmpty()) {
            // GET /api/posts/{id}
            ItemPost post = itemDao.getPostById(subPath);
            if (post != null) {
                sendResponse(exchange, 200, JsonHelper.toJson(post));
            } else {
                sendResponse(exchange, 404, "{\"error\":\"Item not found\"}");
            }
            return;
        }

        // GET /api/posts?type=...&category=...&q=...
        Map<String, String> queryParams = parseQueryParams(uri.getRawQuery());
        String type = queryParams.get("type");
        String category = queryParams.get("category");
        String neighborhood = queryParams.get("neighborhood");
        String q = queryParams.get("q");
        String sort = queryParams.get("sort");
        String status = queryParams.get("status");
        Boolean hasReward = "true".equalsIgnoreCase(queryParams.get("reward"));

        List<ItemPost> posts = itemDao.getAllPosts(type, category, neighborhood, q, sort, status, hasReward);
        sendResponse(exchange, 200, JsonHelper.itemPostsToJson(posts));
    }

    private void handlePost(HttpExchange exchange, String path) throws IOException {
        String subPath = path.substring("/api/posts".length());
        if (subPath.startsWith("/")) subPath = subPath.substring(1);

        if (subPath.endsWith("/like")) {
            // POST /api/posts/{id}/like
            String itemId = subPath.substring(0, subPath.length() - "/like".length());
            Map<String, Object> res = itemDao.toggleLike(itemId);
            sendResponse(exchange, 200, String.format("{\"liked\":%b,\"likesCount\":%d}", res.get("liked"), res.get("likesCount")));
            return;
        }

        if (subPath.endsWith("/save")) {
            // POST /api/posts/{id}/save
            String itemId = subPath.substring(0, subPath.length() - "/save".length());
            boolean saved = itemDao.toggleSave(itemId);
            sendResponse(exchange, 200, String.format("{\"saved\":%b}", saved));
            return;
        }

        // POST /api/posts (Create new item post)
        String body = readRequestBody(exchange);
        ItemPost post = parseItemFromJson(body);
        ItemPost created = itemDao.createPost(post);
        sendResponse(exchange, 201, JsonHelper.toJson(created));
    }

    private void handlePut(HttpExchange exchange, String path) throws IOException {
        String subPath = path.substring("/api/posts".length());
        if (subPath.startsWith("/")) subPath = subPath.substring(1);

        if (subPath.endsWith("/status")) {
            String itemId = subPath.substring(0, subPath.length() - "/status".length());
            String body = readRequestBody(exchange);
            String newStatus = JsonHelper.getString(body, "status", "active");
            boolean ok = itemDao.updateStatus(itemId, newStatus);
            if (ok) {
                sendResponse(exchange, 200, String.format("{\"success\":true,\"status\":\"%s\"}", newStatus));
            } else {
                sendResponse(exchange, 404, "{\"error\":\"Item not found\"}");
            }
            return;
        }

        sendResponse(exchange, 400, "{\"error\":\"Invalid PUT endpoint\"}");
    }

    private void handleDelete(HttpExchange exchange, String path) throws IOException {
        String subPath = path.substring("/api/posts".length());
        if (subPath.startsWith("/")) subPath = subPath.substring(1);

        boolean ok = itemDao.deletePost(subPath);
        if (ok) {
            sendResponse(exchange, 200, "{\"success\":true}");
        } else {
            sendResponse(exchange, 404, "{\"error\":\"Item not found\"}");
        }
    }

    private ItemPost parseItemFromJson(String json) {
        ItemPost p = new ItemPost();
        p.setId(JsonHelper.getString(json, "id", "post_" + System.currentTimeMillis()));
        p.setType(JsonHelper.getString(json, "type", "lost"));
        p.setTitle(JsonHelper.getString(json, "title", "Untitled Item"));
        p.setCategory(JsonHelper.getString(json, "category", "Other"));
        p.setBrand(JsonHelper.getString(json, "brand", ""));
        p.setModel(JsonHelper.getString(json, "model", ""));
        p.setColor(JsonHelper.getString(json, "color", "Not specified"));
        p.setDescription(JsonHelper.getString(json, "description", ""));
        p.setIdentifyingFeatures(JsonHelper.getString(json, "identifyingFeatures", ""));

        // Location fields
        p.setLocationName(JsonHelper.getString(json, "locationName", "Nellore Central"));
        p.setCity(JsonHelper.getString(json, "city", "Nellore"));
        p.setNeighborhood(JsonHelper.getString(json, "neighborhood", "VRC Centre"));
        p.setDistanceKm(JsonHelper.getDouble(json, "distanceKm", 1.2));
        p.setLat(JsonHelper.getDouble(json, "lat", 14.4445));
        p.setLng(JsonHelper.getDouble(json, "lng", 79.9872));

        p.setDateOccurred(JsonHelper.getString(json, "dateOccurred", "Recently"));
        p.setDateReported(JsonHelper.getString(json, "dateReported", new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'").format(new Date())));
        p.setStatus(JsonHelper.getString(json, "status", "active"));

        // Reward fields
        p.setHasReward(JsonHelper.getBoolean(json, "hasReward", false));
        p.setRewardAmount(JsonHelper.getDouble(json, "rewardAmount", 0.0));
        p.setRewardCurrency(JsonHelper.getString(json, "rewardCurrency", "₹"));
        p.setRewardNote(JsonHelper.getString(json, "rewardNote", ""));

        p.setContactPreference(JsonHelper.getString(json, "contactPreference", "foundit_chat"));
        p.setUploaderId(JsonHelper.getString(json, "uploaderId", "usr_me"));
        p.setUploaderName(JsonHelper.getString(json, "uploaderName", "Arjun Rao"));
        p.setUploaderUsername(JsonHelper.getString(json, "uploaderUsername", "arjun_foundit"));
        p.setUploaderAvatar(JsonHelper.getString(json, "uploaderAvatar", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"));

        // Default or parsed image
        String img = JsonHelper.getString(json, "image", null);
        if (img != null && !img.isEmpty()) {
            p.setImages(Collections.singletonList(img));
        } else {
            p.setImages(Collections.singletonList("https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop&q=80"));
        }

        return p;
    }

    private String readRequestBody(HttpExchange exchange) throws IOException {
        try (BufferedReader br = new BufferedReader(new InputStreamReader(exchange.getRequestBody(), StandardCharsets.UTF_8))) {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) {
                sb.append(line);
            }
            return sb.toString();
        }
    }

    private Map<String, String> parseQueryParams(String rawQuery) {
        Map<String, String> params = new HashMap<>();
        if (rawQuery == null || rawQuery.trim().isEmpty()) return params;

        String[] pairs = rawQuery.split("&");
        for (String pair : pairs) {
            int idx = pair.indexOf("=");
            try {
                if (idx > 0) {
                    String key = URLDecoder.decode(pair.substring(0, idx), "UTF-8");
                    String value = URLDecoder.decode(pair.substring(idx + 1), "UTF-8");
                    params.put(key, value);
                } else {
                    params.put(URLDecoder.decode(pair, "UTF-8"), "");
                }
            } catch (Exception e) {
                // ignore
            }
        }
        return params;
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
