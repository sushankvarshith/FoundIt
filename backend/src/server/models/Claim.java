package server.models;

import java.util.ArrayList;
import java.util.List;

/**
 * Claim Entity Model
 * Represents a user claiming an item ("I think this is mine" / "I found this")
 * Maps to 'claims' table in MySQL.
 */
public class Claim {
    private String id;
    private String itemId;
    private String itemTitle;
    private String claimantId;
    private String claimantName;
    private String claimantUsername;
    private String claimantAvatar;
    private String status = "pending"; // "pending", "under_review", "accepted", "rejected"
    private List<Answer> answers = new ArrayList<>();
    private String contactNote;
    private String createdAt;
    private String reviewedAt;

    public static class Answer {
        private String question;
        private String answer;

        public Answer() {}
        public Answer(String question, String answer) {
            this.question = question;
            this.answer = answer;
        }

        public String getQuestion() { return question; }
        public void setQuestion(String question) { this.question = question; }

        public String getAnswer() { return answer; }
        public void setAnswer(String answer) { this.answer = answer; }
    }

    public Claim() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getItemId() { return itemId; }
    public void setItemId(String itemId) { this.itemId = itemId; }

    public String getItemTitle() { return itemTitle; }
    public void setItemTitle(String itemTitle) { this.itemTitle = itemTitle; }

    public String getClaimantId() { return claimantId; }
    public void setClaimantId(String claimantId) { this.claimantId = claimantId; }

    public String getClaimantName() { return claimantName; }
    public void setClaimantName(String claimantName) { this.claimantName = claimantName; }

    public String getClaimantUsername() { return claimantUsername; }
    public void setClaimantUsername(String claimantUsername) { this.claimantUsername = claimantUsername; }

    public String getClaimantAvatar() { return claimantAvatar; }
    public void setClaimantAvatar(String claimantAvatar) { this.claimantAvatar = claimantAvatar; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<Answer> getAnswers() { return answers; }
    public void setAnswers(List<Answer> answers) { this.answers = answers; }

    public String getContactNote() { return contactNote; }
    public void setContactNote(String contactNote) { this.contactNote = contactNote; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(String reviewedAt) { this.reviewedAt = reviewedAt; }
}
