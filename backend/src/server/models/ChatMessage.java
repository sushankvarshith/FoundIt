package server.models;

/**
 * ChatMessage Entity Model
 * Represents a direct message between a finder and an owner.
 * Maps to 'chat_messages' table in MySQL.
 */
public class ChatMessage {
    private String id;
    private String conversationId;
    private String senderId;
    private String receiverId;
    private String itemId;
    private String text;
    private String sentAt;
    private boolean isRead;

    public ChatMessage() {}

    public ChatMessage(String id, String conversationId, String senderId, String receiverId, String itemId, String text, String sentAt, boolean isRead) {
        this.id = id;
        this.conversationId = conversationId;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.itemId = itemId;
        this.text = text;
        this.sentAt = sentAt;
        this.isRead = isRead;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getConversationId() { return conversationId; }
    public void setConversationId(String conversationId) { this.conversationId = conversationId; }

    public String getSenderId() { return senderId; }
    public void setSenderId(String senderId) { this.senderId = senderId; }

    public String getReceiverId() { return receiverId; }
    public void setReceiverId(String receiverId) { this.receiverId = receiverId; }

    public String getItemId() { return itemId; }
    public void setItemId(String itemId) { this.itemId = itemId; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getSentAt() { return sentAt; }
    public void setSentAt(String sentAt) { this.sentAt = sentAt; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }
}
