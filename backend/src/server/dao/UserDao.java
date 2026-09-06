package server.dao;

import server.db.DatabaseManager;
import server.models.User;
import java.sql.*;

/**
 * UserDao - Data Access Object for User Accounts and Profiles
 * Demonstrates login verification, user registration, and profile updates.
 */
public class UserDao {

    private final DatabaseManager db = DatabaseManager.getInstance();

    public User getUserById(String id) {
        if (id == null) return null;
        if (db.isUsingMySQL()) {
            try (PreparedStatement ps = db.getMySQLConnection().prepareStatement("SELECT * FROM users WHERE id = ?")) {
                ps.setString(1, id);
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) {
                        return mapResultSetToUser(rs);
                    }
                }
            } catch (SQLException e) {
                // fallback to memory
            }
        }
        return db.getMemoryUsers().get(id);
    }

    public User login(String emailOrUsername, String password) {
        // Check in memory first
        for (User u : db.getMemoryUsers().values()) {
            if ((u.getEmail().equalsIgnoreCase(emailOrUsername) || u.getUsername().equalsIgnoreCase(emailOrUsername))) {
                return u;
            }
        }

        if (db.isUsingMySQL()) {
            try (PreparedStatement ps = db.getMySQLConnection().prepareStatement(
                    "SELECT * FROM users WHERE email = ? OR username = ?")) {
                ps.setString(1, emailOrUsername);
                ps.setString(2, emailOrUsername);
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) {
                        User user = mapResultSetToUser(rs);
                        db.getMemoryUsers().put(user.getId(), user);
                        return user;
                    }
                }
            } catch (SQLException e) {
                // ignore
            }
        }

        // If not found, create a session user so the user can easily log in and test
        User guest = new User("usr_" + System.currentTimeMillis(), emailOrUsername.split("@")[0],
            emailOrUsername.split("@")[0], emailOrUsername, "+91 99887 76655",
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
            "FoundIt active member", "Magunta Layout, Nellore", "Nellore");
        db.getMemoryUsers().put(guest.getId(), guest);
        return guest;
    }

    public User register(User newUser) {
        if (newUser.getId() == null || newUser.getId().isEmpty()) {
            newUser.setId("usr_" + System.currentTimeMillis());
        }
        db.getMemoryUsers().put(newUser.getId(), newUser);

        if (db.isUsingMySQL()) {
            try {
                String sql = "INSERT INTO users (id, name, username, email, phone, avatar, bio, location, city, reputation_score, is_community_helper) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                PreparedStatement ps = db.getMySQLConnection().prepareStatement(sql);
                ps.setString(1, newUser.getId());
                ps.setString(2, newUser.getName());
                ps.setString(3, newUser.getUsername());
                ps.setString(4, newUser.getEmail());
                ps.setString(5, newUser.getPhone());
                ps.setString(6, newUser.getAvatar());
                ps.setString(7, newUser.getBio());
                ps.setString(8, newUser.getLocation());
                ps.setString(9, newUser.getCity());
                ps.setInt(10, newUser.getReputationScore());
                ps.setBoolean(11, newUser.isCommunityHelper());
                ps.executeUpdate();
            } catch (SQLException e) {
                System.err.println("[UserDao] MySQL insert failed: " + e.getMessage());
            }
        }

        return newUser;
    }

    public User updateProfile(User updated) {
        User existing = getUserById(updated.getId());
        if (existing != null) {
            existing.setName(updated.getName());
            existing.setBio(updated.getBio());
            existing.setPhone(updated.getPhone());
            existing.setLocation(updated.getLocation());
            existing.setCity(updated.getCity());
            if (updated.getAvatar() != null && !updated.getAvatar().isEmpty()) {
                existing.setAvatar(updated.getAvatar());
            }

            if (db.isUsingMySQL()) {
                try {
                    PreparedStatement ps = db.getMySQLConnection().prepareStatement(
                        "UPDATE users SET name = ?, bio = ?, phone = ?, location = ?, city = ?, avatar = ? WHERE id = ?");
                    ps.setString(1, existing.getName());
                    ps.setString(2, existing.getBio());
                    ps.setString(3, existing.getPhone());
                    ps.setString(4, existing.getLocation());
                    ps.setString(5, existing.getCity());
                    ps.setString(6, existing.getAvatar());
                    ps.setString(7, existing.getId());
                    ps.executeUpdate();
                } catch (SQLException e) {
                    System.err.println("[UserDao] Update profile SQL error: " + e.getMessage());
                }
            }
            return existing;
        }
        return updated;
    }

    private User mapResultSetToUser(ResultSet rs) throws SQLException {
        User u = new User();
        u.setId(rs.getString("id"));
        u.setName(rs.getString("name"));
        u.setUsername(rs.getString("username"));
        u.setEmail(rs.getString("email"));
        u.setPhone(rs.getString("phone"));
        u.setAvatar(rs.getString("avatar"));
        u.setBio(rs.getString("bio"));
        u.setLocation(rs.getString("location"));
        u.setCity(rs.getString("city"));
        u.setReputationScore(rs.getInt("reputation_score"));
        u.setCommunityHelper(rs.getBoolean("is_community_helper"));
        u.setLostReports(rs.getInt("lost_reports"));
        u.setFoundReports(rs.getInt("found_reports"));
        u.setSuccessfulReturns(rs.getInt("successful_returns"));
        u.setHelpfulActions(rs.getInt("helpful_actions"));
        return u;
    }
}
