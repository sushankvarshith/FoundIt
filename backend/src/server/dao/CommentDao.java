package server.dao;

import server.db.DatabaseManager;
import server.models.Comment;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * CommentDao - Data Access Object for Post Comments
 */
public class CommentDao {

    private final DatabaseManager db = DatabaseManager.getInstance();

    public List<Comment> getCommentsByItem(String itemId) {
        return db.getMemoryComments().stream()
            .filter(c -> c.getItemId().equals(itemId))
            .collect(Collectors.toList());
    }

    public Comment addComment(Comment c) {
        if (c.getId() == null || c.getId().isEmpty()) {
            c.setId("cmt_" + System.currentTimeMillis());
        }
        if (c.getCreatedAt() == null || c.getCreatedAt().isEmpty()) {
            c.setCreatedAt("Just now");
        }
        db.getMemoryComments().add(c);

        // Update comment count on item
        server.models.ItemPost post = new ItemDao().getPostById(c.getItemId());
        if (post != null) {
            post.setCommentsCount(post.getCommentsCount() + 1);
        }

        return c;
    }

    public boolean toggleLike(String commentId) {
        for (Comment c : db.getMemoryComments()) {
            if (c.getId().equals(commentId)) {
                if (c.isLiked()) {
                    c.setLikes(Math.max(0, c.getLikes() - 1));
                    c.setLiked(false);
                } else {
                    c.setLikes(c.getLikes() + 1);
                    c.setLiked(true);
                }
                return true;
            }
        }
        return false;
    }
}
