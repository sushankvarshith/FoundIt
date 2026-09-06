package server.dao;

import server.db.DatabaseManager;
import server.models.Notification;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * NotificationDao - Data Access Object for Notifications
 */
public class NotificationDao {

    private final DatabaseManager db = DatabaseManager.getInstance();

    public List<Notification> getNotificationsForUser(String userId) {
        return db.getMemoryNotifications().stream()
            .filter(n -> n.getUserId().equals(userId))
            .collect(Collectors.toList());
    }

    public boolean markAsRead(String notificationId) {
        for (Notification n : db.getMemoryNotifications()) {
            if (n.getId().equals(notificationId)) {
                n.setRead(true);
                return true;
            }
        }
        return false;
    }

    public boolean markAllAsRead(String userId) {
        for (Notification n : db.getMemoryNotifications()) {
            if (n.getUserId().equals(userId)) {
                n.setRead(true);
            }
        }
        return true;
    }

    public Notification addNotification(Notification n) {
        if (n.getId() == null || n.getId().isEmpty()) {
            n.setId("notif_" + System.currentTimeMillis());
        }
        if (n.getTimestamp() == null || n.getTimestamp().isEmpty()) {
            n.setTimestamp("Just now");
        }
        db.getMemoryNotifications().add(0, n);
        return n;
    }
}
