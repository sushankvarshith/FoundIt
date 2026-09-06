package server.dao;

import server.db.DatabaseManager;
import server.models.ChatMessage;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * ChatDao - Data Access Object for Direct Messages
 */
public class ChatDao {

    private final DatabaseManager db = DatabaseManager.getInstance();

    public List<ChatMessage> getMessages(String conversationId) {
        return db.getMemoryMessages().stream()
            .filter(m -> m.getConversationId().equals(conversationId))
            .collect(Collectors.toList());
    }

    public ChatMessage sendMessage(ChatMessage msg) {
        if (msg.getId() == null || msg.getId().isEmpty()) {
            msg.setId("msg_" + System.currentTimeMillis());
        }
        if (msg.getSentAt() == null || msg.getSentAt().isEmpty()) {
            msg.setSentAt(new java.text.SimpleDateFormat("hh:mm a").format(new java.util.Date()));
        }
        db.getMemoryMessages().add(msg);
        return msg;
    }

    public List<ChatMessage> getAllMessages() {
        return new ArrayList<>(db.getMemoryMessages());
    }
}
