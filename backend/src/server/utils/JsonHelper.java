package server.utils;

import server.models.*;
import java.util.List;
import java.util.Map;

/**
 * Lightweight Pure Java JSON Helper
 * Converts Java models to/from JSON strings without needing heavy external libraries.
 * Easy to explain during viva: utilizes simple string formatting and key extraction.
 */
public class JsonHelper {

    public static String escape(String s) {
        if (s == null) return "";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            switch (c) {
                case '"': sb.append("\\\""); break;
                case '\\': sb.append("\\\\"); break;
                case '\b': sb.append("\\b"); break;
                case '\f': sb.append("\\f"); break;
                case '\n': sb.append("\\n"); break;
                case '\r': sb.append("\\r"); break;
                case '\t': sb.append("\\t"); break;
                default:
                    if (c < ' ') {
                        String t = "000" + Integer.toHexString(c);
                        sb.append("\\u").append(t.substring(t.length() - 4));
                    } else {
                        sb.append(c);
                    }
            }
        }
        return sb.toString();
    }

    public static String getString(String json, String key, String defaultValue) {
        if (json == null) return defaultValue;
        String pattern = "\"" + key + "\":";
        int idx = json.indexOf(pattern);
        if (idx == -1) return defaultValue;
        
        int start = idx + pattern.length();
        while (start < json.length() && Character.isWhitespace(json.charAt(start))) {
            start++;
        }
        if (start >= json.length()) return defaultValue;

        if (json.charAt(start) == '"') {
            start++;
            StringBuilder sb = new StringBuilder();
            boolean escaped = false;
            for (int i = start; i < json.length(); i++) {
                char c = json.charAt(i);
                if (escaped) {
                    sb.append(c);
                    escaped = false;
                } else if (c == '\\') {
                    escaped = true;
                } else if (c == '"') {
                    return sb.toString();
                } else {
                    sb.append(c);
                }
            }
            return sb.toString();
        } else {
            // Unquoted string or number or boolean
            int end = start;
            while (end < json.length() && json.charAt(end) != ',' && json.charAt(end) != '}' && json.charAt(end) != ']') {
                end++;
            }
            return json.substring(start, end).trim();
        }
    }

    public static double getDouble(String json, String key, double defaultValue) {
        String val = getString(json, key, null);
        if (val == null) return defaultValue;
        try {
            return Double.parseDouble(val);
        } catch (Exception e) {
            return defaultValue;
        }
    }

    public static int getInt(String json, String key, int defaultValue) {
        String val = getString(json, key, null);
        if (val == null) return defaultValue;
        try {
            return Integer.parseInt(val);
        } catch (Exception e) {
            return defaultValue;
        }
    }

    public static boolean getBoolean(String json, String key, boolean defaultValue) {
        String val = getString(json, key, null);
        if (val == null) return defaultValue;
        return "true".equalsIgnoreCase(val);
    }

    public static String toJson(User user) {
        if (user == null) return "null";
        return String.format(
            "{\"id\":\"%s\",\"name\":\"%s\",\"username\":\"%s\",\"email\":\"%s\",\"phone\":\"%s\"," +
            "\"avatar\":\"%s\",\"bio\":\"%s\",\"location\":\"%s\",\"city\":\"%s\",\"reputationScore\":%d," +
            "\"isCommunityHelper\":%b,\"reputationBadge\":\"Community Helper ⭐\",\"stats\":{\"lostReports\":%d,\"foundReports\":%d,\"successfulReturns\":%d,\"helpfulActions\":%d}," +
            "\"settings\":{\"theme\":\"dark\",\"defaultRadiusKm\":10,\"defaultLocation\":\"%s\",\"contactPreferences\":\"app_only\",\"locationVisibility\":\"approximate\",\"profileVisibility\":\"public\"," +
            "\"notifications\":{\"nearbyMatches\":true,\"comments\":true,\"likes\":true,\"claims\":true,\"statusUpdates\":true}}}",
            escape(user.getId()), escape(user.getName()), escape(user.getUsername()), escape(user.getEmail()),
            escape(user.getPhone()), escape(user.getAvatar()), escape(user.getBio()), escape(user.getLocation()),
            escape(user.getCity()), user.getReputationScore(), user.isCommunityHelper(),
            user.getLostReports(), user.getFoundReports(), user.getSuccessfulReturns(), user.getHelpfulActions(),
            escape(user.getLocation())
        );
    }

    public static String toJson(ItemPost item) {
        if (item == null) return "null";

        StringBuilder imgJson = new StringBuilder("[");
        List<String> imgs = item.getImages();
        for (int i = 0; i < imgs.size(); i++) {
            imgJson.append("\"").append(escape(imgs.get(i))).append("\"");
            if (i < imgs.size() - 1) imgJson.append(",");
        }
        imgJson.append("]");

        return String.format(
            "{" +
            "\"id\":\"%s\"," +
            "\"type\":\"%s\"," +
            "\"title\":\"%s\"," +
            "\"category\":\"%s\"," +
            "\"brand\":\"%s\"," +
            "\"model\":\"%s\"," +
            "\"color\":\"%s\"," +
            "\"description\":\"%s\"," +
            "\"identifyingFeatures\":\"%s\"," +
            "\"images\":%s," +
            "\"location\":{\"name\":\"%s\",\"city\":\"%s\",\"neighborhood\":\"%s\",\"distanceKm\":%.2f,\"lat\":%.6f,\"lng\":%.6f,\"approximate\":%b}," +
            "\"dateOccurred\":\"%s\"," +
            "\"dateReported\":\"%s\"," +
            "\"status\":\"%s\"," +
            "\"reward\":{\"hasReward\":%b,\"amount\":%.2f,\"currency\":\"%s\",\"note\":\"%s\"}," +
            "\"uploader\":{\"id\":\"%s\",\"name\":\"%s\",\"username\":\"%s\",\"avatar\":\"%s\",\"rating\":4.9,\"returnsCount\":4,\"isVerifiedHelper\":true}," +
            "\"stats\":{\"likes\":%d,\"commentsCount\":%d,\"shares\":%d}," +
            "\"userInteractions\":{\"liked\":%b,\"saved\":%b}," +
            "\"contactPreference\":\"%s\"" +
            "}",
            escape(item.getId()),
            escape(item.getType()),
            escape(item.getTitle()),
            escape(item.getCategory()),
            escape(item.getBrand() != null ? item.getBrand() : ""),
            escape(item.getModel() != null ? item.getModel() : ""),
            escape(item.getColor()),
            escape(item.getDescription()),
            escape(item.getIdentifyingFeatures() != null ? item.getIdentifyingFeatures() : ""),
            imgJson.toString(),
            escape(item.getLocationName()),
            escape(item.getCity()),
            escape(item.getNeighborhood()),
            item.getDistanceKm(),
            item.getLat(),
            item.getLng(),
            item.isApproximate(),
            escape(item.getDateOccurred()),
            escape(item.getDateReported()),
            escape(item.getStatus()),
            item.isHasReward(),
            item.getRewardAmount(),
            escape(item.getRewardCurrency()),
            escape(item.getRewardNote() != null ? item.getRewardNote() : ""),
            escape(item.getUploaderId()),
            escape(item.getUploaderName()),
            escape(item.getUploaderUsername()),
            escape(item.getUploaderAvatar()),
            item.getLikesCount(),
            item.getCommentsCount(),
            item.getSharesCount(),
            item.isLiked(),
            item.isSaved(),
            escape(item.getContactPreference())
        );
    }

    public static String itemPostsToJson(List<ItemPost> items) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < items.size(); i++) {
            sb.append(toJson(items.get(i)));
            if (i < items.size() - 1) sb.append(",");
        }
        sb.append("]");
        return sb.toString();
    }

    public static String toJson(Claim claim) {
        if (claim == null) return "null";
        StringBuilder answersJson = new StringBuilder("[");
        List<Claim.Answer> answers = claim.getAnswers();
        for (int i = 0; i < answers.size(); i++) {
            answersJson.append(String.format("{\"question\":\"%s\",\"answer\":\"%s\"}",
                escape(answers.get(i).getQuestion()), escape(answers.get(i).getAnswer())));
            if (i < answers.size() - 1) answersJson.append(",");
        }
        answersJson.append("]");

        return String.format(
            "{\"id\":\"%s\",\"itemId\":\"%s\",\"itemTitle\":\"%s\"," +
            "\"claimant\":{\"id\":\"%s\",\"name\":\"%s\",\"username\":\"%s\",\"avatar\":\"%s\"}," +
            "\"status\":\"%s\",\"answers\":%s,\"contactNote\":\"%s\",\"createdAt\":\"%s\"}",
            escape(claim.getId()), escape(claim.getItemId()), escape(claim.getItemTitle()),
            escape(claim.getClaimantId()), escape(claim.getClaimantName()), escape(claim.getClaimantUsername()), escape(claim.getClaimantAvatar()),
            escape(claim.getStatus()), answersJson.toString(), escape(claim.getContactNote()), escape(claim.getCreatedAt())
        );
    }

    public static String claimsToJson(List<Claim> claims) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < claims.size(); i++) {
            sb.append(toJson(claims.get(i)));
            if (i < claims.size() - 1) sb.append(",");
        }
        sb.append("]");
        return sb.toString();
    }

    public static String toJson(Comment c) {
        if (c == null) return "null";
        return String.format(
            "{\"id\":\"%s\",\"itemId\":\"%s\",\"user\":{\"id\":\"%s\",\"name\":\"%s\",\"username\":\"%s\",\"avatar\":\"%s\"}," +
            "\"text\":\"%s\",\"createdAt\":\"%s\",\"likes\":%d,\"isLiked\":%b}",
            escape(c.getId()), escape(c.getItemId()), escape(c.getUserId()), escape(c.getUserName()),
            escape(c.getUserName().toLowerCase().replace(" ", "_")), escape(c.getUserAvatar()),
            escape(c.getText()), escape(c.getCreatedAt()), c.getLikes(), c.isLiked()
        );
    }

    public static String commentsToJson(List<Comment> comments) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < comments.size(); i++) {
            sb.append(toJson(comments.get(i)));
            if (i < comments.size() - 1) sb.append(",");
        }
        sb.append("]");
        return sb.toString();
    }

    public static String toJson(ChatMessage msg) {
        if (msg == null) return "null";
        return String.format(
            "{\"id\":\"%s\",\"conversationId\":\"%s\",\"senderId\":\"%s\",\"receiverId\":\"%s\",\"itemId\":\"%s\",\"text\":\"%s\",\"sentAt\":\"%s\",\"isRead\":%b}",
            escape(msg.getId()), escape(msg.getConversationId()), escape(msg.getSenderId()),
            escape(msg.getReceiverId()), escape(msg.getItemId() != null ? msg.getItemId() : ""),
            escape(msg.getText()), escape(msg.getSentAt()), msg.isRead()
        );
    }

    public static String chatMessagesToJson(List<ChatMessage> messages) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < messages.size(); i++) {
            sb.append(toJson(messages.get(i)));
            if (i < messages.size() - 1) sb.append(",");
        }
        sb.append("]");
        return sb.toString();
    }

    public static String toJson(Notification n) {
        if (n == null) return "null";
        return String.format(
            "{\"id\":\"%s\",\"userId\":\"%s\",\"type\":\"%s\",\"title\":\"%s\",\"message\":\"%s\",\"itemId\":\"%s\",\"read\":%b,\"timestamp\":\"%s\"}",
            escape(n.getId()), escape(n.getUserId()), escape(n.getType()), escape(n.getTitle()),
            escape(n.getMessage()), escape(n.getItemId() != null ? n.getItemId() : ""), n.isRead(), escape(n.getTimestamp())
        );
    }

    public static String notificationsToJson(List<Notification> notifs) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < notifs.size(); i++) {
            sb.append(toJson(notifs.get(i)));
            if (i < notifs.size() - 1) sb.append(",");
        }
        sb.append("]");
        return sb.toString();
    }
}
