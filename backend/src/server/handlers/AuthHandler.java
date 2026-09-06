package server.handlers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import server.dao.UserDao;
import server.models.User;
import server.utils.CorsHelper;
import server.utils.JsonHelper;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

/**
 * AuthHandler - Endpoint: /api/auth
 * Handles user authentication (login, signup), current session info, and profile updates.
 */
public class AuthHandler implements HttpHandler {

    private final UserDao userDao = new UserDao();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (CorsHelper.handlePreflight(exchange)) return;
        CorsHelper.applyCorsHeaders(exchange);

        String method = exchange.getRequestMethod().toUpperCase();
        String path = exchange.getRequestURI().getPath();

        try {
            if (path.endsWith("/login") && "POST".equals(method)) {
                handleLogin(exchange);
            } else if (path.endsWith("/register") && "POST".equals(method)) {
                handleRegister(exchange);
            } else if (path.endsWith("/profile") && "PUT".equals(method)) {
                handleUpdateProfile(exchange);
            } else if ("GET".equals(method)) {
                // Return default current user
                User me = userDao.getUserById("usr_me");
                if (me == null) {
                    me = new User("usr_me", "Arjun Rao", "arjun_foundit", "arjun.rao@gmail.com", "+91 98765 43210",
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                        "Community volunteer based in Nellore, Andhra Pradesh.", "Magunta Layout, Nellore", "Nellore");
                }
                sendResponse(exchange, 200, JsonHelper.toJson(me));
            } else {
                sendResponse(exchange, 404, "{\"error\":\"Auth route not found\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            sendResponse(exchange, 500, "{\"error\":\"" + JsonHelper.escape(e.getMessage()) + "\"}");
        }
    }

    private void handleLogin(HttpExchange exchange) throws IOException {
        String body = readBody(exchange);
        String username = JsonHelper.getString(body, "username", "");
        String password = JsonHelper.getString(body, "password", "");

        if (username.isEmpty()) {
            sendResponse(exchange, 400, "{\"error\":\"Username/email is required\"}");
            return;
        }

        User user = userDao.login(username, password);
        sendResponse(exchange, 200, JsonHelper.toJson(user));
    }

    private void handleRegister(HttpExchange exchange) throws IOException {
        String body = readBody(exchange);
        String name = JsonHelper.getString(body, "name", "Community Member");
        String username = JsonHelper.getString(body, "username", "user_" + System.currentTimeMillis());
        String email = JsonHelper.getString(body, "email", username + "@example.com");
        String phone = JsonHelper.getString(body, "phone", "+91 90000 00000");

        User newUser = new User("usr_" + System.currentTimeMillis(), name, username, email, phone,
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
            "Active FoundIt community helper in Andhra Pradesh.", "Nellore", "Nellore");

        User created = userDao.register(newUser);
        sendResponse(exchange, 201, JsonHelper.toJson(created));
    }

    private void handleUpdateProfile(HttpExchange exchange) throws IOException {
        String body = readBody(exchange);
        String id = JsonHelper.getString(body, "id", "usr_me");
        User user = userDao.getUserById(id);
        if (user == null) {
            user = new User(id, "Arjun Rao", "arjun_foundit", "arjun.rao@gmail.com", "", "", "", "", "Nellore");
        }

        user.setName(JsonHelper.getString(body, "name", user.getName()));
        user.setBio(JsonHelper.getString(body, "bio", user.getBio()));
        user.setPhone(JsonHelper.getString(body, "phone", user.getPhone()));
        user.setLocation(JsonHelper.getString(body, "location", user.getLocation()));
        user.setCity(JsonHelper.getString(body, "city", user.getCity()));

        String avatar = JsonHelper.getString(body, "avatar", null);
        if (avatar != null && !avatar.isEmpty()) user.setAvatar(avatar);

        User saved = userDao.updateProfile(user);
        sendResponse(exchange, 200, JsonHelper.toJson(saved));
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
