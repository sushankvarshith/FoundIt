package server.handlers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import server.dao.ClaimDao;
import server.models.Claim;
import server.utils.CorsHelper;
import server.utils.JsonHelper;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * ClaimsHandler - Endpoint: /api/claims
 * Handles item ownership claims and claim status updates.
 */
public class ClaimsHandler implements HttpHandler {

    private final ClaimDao claimDao = new ClaimDao();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (CorsHelper.handlePreflight(exchange)) return;
        CorsHelper.applyCorsHeaders(exchange);

        String method = exchange.getRequestMethod().toUpperCase();
        String path = exchange.getRequestURI().getPath();

        try {
            if ("GET".equals(method)) {
                List<Claim> claims = claimDao.getAllClaims();
                sendResponse(exchange, 200, JsonHelper.claimsToJson(claims));
            } else if ("POST".equals(method)) {
                String body = readBody(exchange);
                Claim claim = new Claim();
                claim.setItemId(JsonHelper.getString(body, "itemId", ""));
                claim.setItemTitle(JsonHelper.getString(body, "itemTitle", "Item"));
                claim.setClaimantId(JsonHelper.getString(body, "claimantId", "usr_me"));
                claim.setClaimantName(JsonHelper.getString(body, "claimantName", "Arjun Rao"));
                claim.setClaimantUsername(JsonHelper.getString(body, "claimantUsername", "arjun_foundit"));
                claim.setClaimantAvatar(JsonHelper.getString(body, "claimantAvatar", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"));
                claim.setContactNote(JsonHelper.getString(body, "contactNote", ""));

                // Add standard answers
                String q1 = JsonHelper.getString(body, "q1", "What identifying marks or items were present?");
                String a1 = JsonHelper.getString(body, "a1", "Provided during submission");
                claim.getAnswers().add(new Claim.Answer(q1, a1));

                Claim created = claimDao.createClaim(claim);
                sendResponse(exchange, 201, JsonHelper.toJson(created));
            } else if ("PUT".equals(method) && path.endsWith("/status")) {
                String sub = path.substring("/api/claims/".length());
                String claimId = sub.substring(0, sub.indexOf("/status"));
                String body = readBody(exchange);
                String newStatus = JsonHelper.getString(body, "status", "accepted");
                boolean ok = claimDao.updateClaimStatus(claimId, newStatus);
                sendResponse(exchange, ok ? 200 : 404, String.format("{\"success\":%b}", ok));
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
