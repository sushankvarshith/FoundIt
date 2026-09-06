package server.models;

/**
 * Notification Entity Model
 * Represents an in-app alert or notification.
 * Maps to 'notifications' table in MySQL.
 */
public class Notification {
    private String id;
    private String userId;
    private String type; // 'comment' | 'match_found' | 'claim_received' | 'claim_accepted' | 'status'
    private String title;
    private String message;
    private String itemId;
    private boolean read;
    private String timestamp;

    public Notification() {}

    public Notification(String id, String userId, String type, String title, String message, String itemId, boolean read, String timestamp) {
        this.id = id;
        this.userId = userId;
        this.type = type;
        this.title = title;
        this.message = message;
        this.itemId = itemId;
        this.read = read;
        this.timestamp = timestamp;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getItemId() { return itemId; }
    public void setItemId(String itemId) { this.itemId = itemId; }

    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
}
