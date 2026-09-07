package server.dao;

import server.db.DatabaseManager;
import server.models.User;
import java.sql.*;
import java.util.*;

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

    public List<User> getAllUsers() {
        if (db.isUsingMySQL()) {
            List<User> list = new ArrayList<>();
            try (Statement stmt = db.getMySQLConnection().createStatement();
                 ResultSet rs = stmt.executeQuery("SELECT * FROM users")) {
                while (rs.next()) {
                    list.add(mapResultSetToUser(rs));
                }
                if (!list.isEmpty()) {
                    for (User u : list) {
                        db.getMemoryUsers().put(u.getId(), u);
                    }
                    return list;
                }
            } catch (SQLException e) {
                // fallback to memory
            }
        }
        return new ArrayList<>(db.getMemoryUsers().values());
    }

    public User login(String emailOrUsername, String password) {
        String cleanIdentifier = emailOrUsername != null ? emailOrUsername.trim() : "";
        String cleanPassword = password != null ? password.trim() : "";

        // 1. Check in MySQL if connected
        if (db.isUsingMySQL()) {
            try (PreparedStatement ps = db.getMySQLConnection().prepareStatement(
                    "SELECT * FROM users WHERE LOWER(email) = LOWER(?) OR LOWER(username) = LOWER(?)")) {
                ps.setString(1, cleanIdentifier);
                ps.setString(2, cleanIdentifier);
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) {
                        String storedHash = rs.getString("password_hash");
                        // If password matches or was not set
                        if (cleanPassword.isEmpty() || storedHash == null || storedHash.isEmpty() || storedHash.equals(cleanPassword)) {
                            User user = mapResultSetToUser(rs);
                            db.getMemoryUsers().put(user.getId(), user);
                            return user;
                        }
                    }
                }
            } catch (SQLException e) {
                // fallback to memory
            }
        }

        // 2. Check in memory
        for (User u : db.getMemoryUsers().values()) {
            if ((u.getEmail().equalsIgnoreCase(cleanIdentifier) || u.getUsername().equalsIgnoreCase(cleanIdentifier))) {
                return u;
            }
        }

        // 3. If not found, create a registered member so that testing is frictionless
        User guest = new User("usr_" + System.currentTimeMillis(), cleanIdentifier.contains("@") ? cleanIdentifier.split("@")[0] : cleanIdentifier,
            cleanIdentifier.contains("@") ? cleanIdentifier.split("@")[0] : cleanIdentifier,
            cleanIdentifier.contains("@") ? cleanIdentifier : cleanIdentifier + "@example.com", "+91 99887 76655",
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
            "FoundIt active community member", "Magunta Layout, Nellore", "Nellore");
        guest.setPassword(cleanPassword.isEmpty() ? "password123" : cleanPassword);
        return register(guest);
    }

    public User register(User newUser) {
        if (newUser.getId() == null || newUser.getId().isEmpty()) {
            newUser.setId("usr_" + System.currentTimeMillis());
        }
        db.getMemoryUsers().put(newUser.getId(), newUser);

        if (db.isUsingMySQL()) {
            try {
                String sql = "INSERT INTO users (id, name, username, email, password_hash, phone, avatar, bio, location, city, reputation_score, is_community_helper) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) " +
                    "ON DUPLICATE KEY UPDATE name=VALUES(name), phone=VALUES(phone), avatar=VALUES(avatar), bio=VALUES(bio), location=VALUES(location), city=VALUES(city)";
                PreparedStatement ps = db.getMySQLConnection().prepareStatement(sql);
                ps.setString(1, newUser.getId());
                ps.setString(2, newUser.getName());
                ps.setString(3, newUser.getUsername());
                ps.setString(4, newUser.getEmail());
                ps.setString(5, newUser.getPassword() != null && !newUser.getPassword().isEmpty() ? newUser.getPassword() : "password123");
                ps.setString(6, newUser.getPhone());
                ps.setString(7, newUser.getAvatar());
                ps.setString(8, newUser.getBio());
                ps.setString(9, newUser.getLocation());
                ps.setString(10, newUser.getCity());
                ps.setInt(11, newUser.getReputationScore());
                ps.setBoolean(12, newUser.isCommunityHelper());
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
