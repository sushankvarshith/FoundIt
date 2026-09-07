package server.dao;

import server.db.DatabaseManager;
import server.models.ItemPost;
import java.sql.*;
import java.util.*;
import java.util.stream.Collectors;

/**
 * ItemDao - Data Access Object for Item Posts
 * Demonstrates standard JDBC PreparedStatement queries:
 * SELECT, INSERT, UPDATE, DELETE with parameterized queries for SQL injection prevention.
 */
public class ItemDao {

    private final DatabaseManager db = DatabaseManager.getInstance();

    public List<ItemPost> getAllPosts(String type, String category, String neighborhood, String searchQuery, String sortBy, String status, Boolean hasReward) {
        if (!db.isUsingMySQL()) {
            return getFilteredFromMemory(type, category, neighborhood, searchQuery, sortBy, status, hasReward);
        }

        List<ItemPost> list = new ArrayList<>();
        StringBuilder sql = new StringBuilder(
            "SELECT items.*, u.name AS uploader_name, u.username AS uploader_username, u.avatar AS uploader_avatar " +
            "FROM items LEFT JOIN users u ON items.uploader_id = u.id WHERE 1=1 ");
        List<Object> params = new ArrayList<>();

        if (type != null && !type.equalsIgnoreCase("all") && !type.isEmpty()) {
            sql.append("AND items.type = ? ");
            params.add(type.toLowerCase());
        }
        if (category != null && !category.equalsIgnoreCase("all") && !category.isEmpty()) {
            sql.append("AND items.category = ? ");
            params.add(category);
        }
        if (neighborhood != null && !neighborhood.equalsIgnoreCase("all") && !neighborhood.isEmpty()) {
            sql.append("AND items.neighborhood = ? ");
            params.add(neighborhood);
        }
        if (status != null && !status.equalsIgnoreCase("all") && !status.isEmpty()) {
            sql.append("AND items.status = ? ");
            params.add(status.toLowerCase());
        }
        if (hasReward != null && hasReward) {
            sql.append("AND items.has_reward = 1 ");
        }
        if (searchQuery != null && !searchQuery.trim().isEmpty()) {
            sql.append("AND (LOWER(items.title) LIKE ? OR LOWER(items.description) LIKE ? OR LOWER(items.brand) LIKE ? OR LOWER(items.model) LIKE ? OR LOWER(items.neighborhood) LIKE ?) ");
            String q = "%" + searchQuery.toLowerCase().trim() + "%";
            params.add(q); params.add(q); params.add(q); params.add(q); params.add(q);
        }

        // Sorting
        if ("closest".equalsIgnoreCase(sortBy)) {
            sql.append("ORDER BY items.distance_km ASC ");
        } else if ("liked".equalsIgnoreCase(sortBy)) {
            sql.append("ORDER BY items.likes_count DESC ");
        } else if ("commented".equalsIgnoreCase(sortBy)) {
            sql.append("ORDER BY items.comments_count DESC ");
        } else {
            sql.append("ORDER BY items.date_reported DESC ");
        }

        try (PreparedStatement ps = db.getMySQLConnection().prepareStatement(sql.toString())) {
            for (int i = 0; i < params.size(); i++) {
                ps.setObject(i + 1, params.get(i));
            }
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToItem(rs));
                }
            }
            return list;
        } catch (SQLException e) {
            System.err.println("[ItemDao] Query error, falling back to memory: " + e.getMessage());
            return getFilteredFromMemory(type, category, neighborhood, searchQuery, sortBy, status, hasReward);
        }
    }

    private List<ItemPost> getFilteredFromMemory(String type, String category, String neighborhood, String searchQuery, String sortBy, String status, Boolean hasReward) {
        List<ItemPost> stream = new ArrayList<>(db.getMemoryItems());

        if (type != null && !type.equalsIgnoreCase("all") && !type.isEmpty()) {
            stream = stream.stream().filter(p -> p.getType().equalsIgnoreCase(type)).collect(Collectors.toList());
        }
        if (category != null && !category.equalsIgnoreCase("all") && !category.isEmpty()) {
            stream = stream.stream().filter(p -> p.getCategory().equalsIgnoreCase(category)).collect(Collectors.toList());
        }
        if (neighborhood != null && !neighborhood.equalsIgnoreCase("all") && !neighborhood.isEmpty()) {
            stream = stream.stream().filter(p -> p.getNeighborhood().equalsIgnoreCase(neighborhood)).collect(Collectors.toList());
        }
        if (status != null && !status.equalsIgnoreCase("all") && !status.isEmpty()) {
            stream = stream.stream().filter(p -> p.getStatus().equalsIgnoreCase(status)).collect(Collectors.toList());
        }
        if (hasReward != null && hasReward) {
            stream = stream.stream().filter(ItemPost::isHasReward).collect(Collectors.toList());
        }
        if (searchQuery != null && !searchQuery.trim().isEmpty()) {
            String q = searchQuery.toLowerCase().trim();
            stream = stream.stream().filter(p ->
                (p.getTitle() != null && p.getTitle().toLowerCase().contains(q)) ||
                (p.getDescription() != null && p.getDescription().toLowerCase().contains(q)) ||
                (p.getBrand() != null && p.getBrand().toLowerCase().contains(q)) ||
                (p.getModel() != null && p.getModel().toLowerCase().contains(q)) ||
                (p.getNeighborhood() != null && p.getNeighborhood().toLowerCase().contains(q))
            ).collect(Collectors.toList());
        }

        if ("closest".equalsIgnoreCase(sortBy)) {
            stream.sort(Comparator.comparingDouble(ItemPost::getDistanceKm));
        } else if ("liked".equalsIgnoreCase(sortBy)) {
            stream.sort((a, b) -> Integer.compare(b.getLikesCount(), a.getLikesCount()));
        } else if ("commented".equalsIgnoreCase(sortBy)) {
            stream.sort((a, b) -> Integer.compare(b.getCommentsCount(), a.getCommentsCount()));
        }

        // Apply like/save flags
        for (ItemPost p : stream) {
            p.setLiked(db.getMemoryLikedItems().contains(p.getId()));
            p.setSaved(db.getMemorySavedItems().contains(p.getId()));
        }

        return stream;
    }

    public ItemPost getPostById(String id) {
        if (id == null) return null;
        for (ItemPost p : db.getMemoryItems()) {
            if (p.getId().equals(id)) {
                p.setLiked(db.getMemoryLikedItems().contains(p.getId()));
                p.setSaved(db.getMemorySavedItems().contains(p.getId()));
                return p;
            }
        }
        return null;
    }

    public ItemPost createPost(ItemPost post) {
        if (post.getId() == null || post.getId().isEmpty()) {
            post.setId("post_" + System.currentTimeMillis());
        }
        if (post.getDateReported() == null || post.getDateReported().isEmpty()) {
            post.setDateReported(new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'").format(new java.util.Date()));
        }

        // Ensure uploader exists in users table/memory so JOIN works
        if (post.getUploaderId() != null && !post.getUploaderId().isEmpty()) {
            UserDao uDao = new UserDao();
            if (uDao.getUserById(post.getUploaderId()) == null) {
                server.models.User uStub = new server.models.User(
                    post.getUploaderId(),
                    post.getUploaderName() != null ? post.getUploaderName() : "Community Member",
                    post.getUploaderUsername() != null ? post.getUploaderUsername() : post.getUploaderId(),
                    (post.getUploaderUsername() != null ? post.getUploaderUsername() : post.getUploaderId()) + "@foundit.community",
                    "+91 90000 00000",
                    post.getUploaderAvatar() != null ? post.getUploaderAvatar() : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
                    "FoundIt community contributor",
                    post.getLocationName() != null ? post.getLocationName() : "Nellore",
                    post.getCity() != null ? post.getCity() : "Nellore"
                );
                uDao.register(uStub);
            }
        }

        // Add to memory list
        db.getMemoryItems().add(0, post);

        // Add to MySQL if connected
        if (db.isUsingMySQL()) {
            try {
                String sql = "INSERT INTO items (id, type, title, category, brand, model, color, description, identifying_features, images, " +
                    "location_name, city, neighborhood, distance_km, lat, lng, approximate, date_occurred, date_reported, status, " +
                    "has_reward, reward_amount, reward_currency, reward_note, uploader_id, contact_preference, likes_count, comments_count, shares_count) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                PreparedStatement ps = db.getMySQLConnection().prepareStatement(sql);
                ps.setString(1, post.getId());
                ps.setString(2, post.getType());
                ps.setString(3, post.getTitle());
                ps.setString(4, post.getCategory());
                ps.setString(5, post.getBrand());
                ps.setString(6, post.getModel());
                ps.setString(7, post.getColor());
                ps.setString(8, post.getDescription());
                ps.setString(9, post.getIdentifyingFeatures());
                ps.setString(10, String.join("||", post.getImages()));
                ps.setString(11, post.getLocationName());
                ps.setString(12, post.getCity());
                ps.setString(13, post.getNeighborhood());
                ps.setDouble(14, post.getDistanceKm());
                ps.setDouble(15, post.getLat());
                ps.setDouble(16, post.getLng());
                ps.setBoolean(17, post.isApproximate());
                ps.setString(18, post.getDateOccurred());
                ps.setString(19, post.getDateReported());
                ps.setString(20, post.getStatus());
                ps.setBoolean(21, post.isHasReward());
                ps.setDouble(22, post.getRewardAmount());
                ps.setString(23, post.getRewardCurrency());
                ps.setString(24, post.getRewardNote());
                ps.setString(25, post.getUploaderId() != null ? post.getUploaderId() : "usr_me");
                ps.setString(26, post.getContactPreference());
                ps.setInt(27, 0);
                ps.setInt(28, 0);
                ps.setInt(29, 0);
                ps.executeUpdate();
            } catch (SQLException e) {
                System.err.println("[ItemDao] Failed to insert into MySQL: " + e.getMessage());
            }
        }

        return post;
    }

    public boolean updateStatus(String id, String newStatus) {
        ItemPost p = getPostById(id);
        if (p != null) {
            p.setStatus(newStatus);
            if (db.isUsingMySQL()) {
                try (PreparedStatement ps = db.getMySQLConnection().prepareStatement("UPDATE items SET status = ? WHERE id = ?")) {
                    ps.setString(1, newStatus);
                    ps.setString(2, id);
                    ps.executeUpdate();
                } catch (SQLException e) {
                    System.err.println("[ItemDao] MySQL status update failed: " + e.getMessage());
                }
            }
            return true;
        }
        return false;
    }

    public Map<String, Object> toggleLike(String id) {
        Map<String, Object> result = new HashMap<>();
        ItemPost p = getPostById(id);
        if (p == null) {
            result.put("liked", false);
            result.put("likesCount", 0);
            return result;
        }

        boolean currentlyLiked = db.getMemoryLikedItems().contains(id);
        if (currentlyLiked) {
            db.getMemoryLikedItems().remove(id);
            p.setLikesCount(Math.max(0, p.getLikesCount() - 1));
            p.setLiked(false);
        } else {
            db.getMemoryLikedItems().add(id);
            p.setLikesCount(p.getLikesCount() + 1);
            p.setLiked(true);
        }

        if (db.isUsingMySQL()) {
            try (PreparedStatement ps = db.getMySQLConnection().prepareStatement("UPDATE items SET likes_count = ? WHERE id = ?")) {
                ps.setInt(1, p.getLikesCount());
                ps.setString(2, id);
                ps.executeUpdate();
            } catch (SQLException e) {
                // ignore
            }
        }

        result.put("liked", p.isLiked());
        result.put("likesCount", p.getLikesCount());
        return result;
    }

    public boolean toggleSave(String id) {
        ItemPost p = getPostById(id);
        if (p == null) return false;

        boolean currentlySaved = db.getMemorySavedItems().contains(id);
        if (currentlySaved) {
            db.getMemorySavedItems().remove(id);
            p.setSaved(false);
            return false;
        } else {
            db.getMemorySavedItems().add(id);
            p.setSaved(true);
            return true;
        }
    }

    public boolean deletePost(String id) {
        boolean removed = db.getMemoryItems().removeIf(p -> p.getId().equals(id));
        if (db.isUsingMySQL()) {
            try (PreparedStatement ps = db.getMySQLConnection().prepareStatement("DELETE FROM items WHERE id = ?")) {
                ps.setString(1, id);
                ps.executeUpdate();
            } catch (SQLException e) {
                // ignore
            }
        }
        return removed;
    }

    private ItemPost mapResultSetToItem(ResultSet rs) throws SQLException {
        ItemPost p = new ItemPost();
        p.setId(rs.getString("id"));
        p.setType(rs.getString("type"));
        p.setTitle(rs.getString("title"));
        p.setCategory(rs.getString("category"));
        p.setBrand(rs.getString("brand"));
        p.setModel(rs.getString("model"));
        p.setColor(rs.getString("color"));
        p.setDescription(rs.getString("description"));
        p.setIdentifyingFeatures(rs.getString("identifying_features"));
        
        String imgs = rs.getString("images");
        if (imgs != null && !imgs.isEmpty()) {
            p.setImages(Arrays.asList(imgs.split("\\|\\|")));
        }
        
        p.setLocationName(rs.getString("location_name"));
        p.setCity(rs.getString("city"));
        p.setNeighborhood(rs.getString("neighborhood"));
        p.setDistanceKm(rs.getDouble("distance_km"));
        p.setLat(rs.getDouble("lat"));
        p.setLng(rs.getDouble("lng"));
        p.setApproximate(rs.getBoolean("approximate"));
        p.setDateOccurred(rs.getString("date_occurred"));
        p.setDateReported(rs.getString("date_reported"));
        p.setStatus(rs.getString("status"));
        p.setHasReward(rs.getBoolean("has_reward"));
        p.setRewardAmount(rs.getDouble("reward_amount"));
        p.setRewardCurrency(rs.getString("reward_currency"));
        p.setRewardNote(rs.getString("reward_note"));
        p.setUploaderId(rs.getString("uploader_id"));
        try {
            String uName = rs.getString("uploader_name");
            if (uName != null && !uName.isEmpty()) {
                p.setUploaderName(uName);
                p.setUploaderUsername(rs.getString("uploader_username"));
                p.setUploaderAvatar(rs.getString("uploader_avatar"));
            }
        } catch (SQLException ignored) {}
        p.setContactPreference(rs.getString("contact_preference"));
        p.setLikesCount(rs.getInt("likes_count"));
        p.setCommentsCount(rs.getInt("comments_count"));
        p.setSharesCount(rs.getInt("shares_count"));

        p.setLiked(db.getMemoryLikedItems().contains(p.getId()));
        p.setSaved(db.getMemorySavedItems().contains(p.getId()));

        return p;
    }
}
