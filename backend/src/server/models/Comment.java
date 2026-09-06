package server.models;

/**
 * Comment Entity Model
 * Represents a community discussion comment under a post.
 * Maps to 'comments' table in MySQL.
 */
public class Comment {
    private String id;
    private String itemId;
    private String userId;
    private String userName;
    private String userAvatar;
    private String text;
    private String createdAt;
    private int likes;
    private boolean isLiked;

    public Comment() {}

    public Comment(String id, String itemId, String userId, String userName, String userAvatar, String text, String createdAt, int likes) {
        this.id = id;
        this.itemId = itemId;
        this.userId = userId;
        this.userName = userName;
        this.userAvatar = userAvatar;
        this.text = text;
        this.createdAt = createdAt;
        this.likes = likes;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getItemId() { return itemId; }
    public void setItemId(String itemId) { this.itemId = itemId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserAvatar() { return userAvatar; }
    public void setUserAvatar(String userAvatar) { this.userAvatar = userAvatar; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public int getLikes() { return likes; }
    public void setLikes(int likes) { this.likes = likes; }

    public boolean isLiked() { return isLiked; }
    public void setLiked(boolean liked) { isLiked = liked; }
}
