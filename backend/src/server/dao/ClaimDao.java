package server.dao;

import server.db.DatabaseManager;
import server.models.Claim;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * ClaimDao - Data Access Object for Item Ownership Claims
 */
public class ClaimDao {

    private final DatabaseManager db = DatabaseManager.getInstance();

    public List<Claim> getClaimsByItemId(String itemId) {
        return db.getMemoryClaims().stream()
            .filter(c -> c.getItemId().equals(itemId))
            .collect(Collectors.toList());
    }

    public List<Claim> getClaimsByUser(String userId) {
        return db.getMemoryClaims().stream()
            .filter(c -> c.getClaimantId().equals(userId))
            .collect(Collectors.toList());
    }

    public List<Claim> getAllClaims() {
        return new ArrayList<>(db.getMemoryClaims());
    }

    public Claim createClaim(Claim claim) {
        if (claim.getId() == null || claim.getId().isEmpty()) {
            claim.setId("claim_" + System.currentTimeMillis());
        }
        if (claim.getCreatedAt() == null || claim.getCreatedAt().isEmpty()) {
            claim.setCreatedAt(new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'").format(new java.util.Date()));
        }
        claim.setStatus("pending");
        db.getMemoryClaims().add(0, claim);
        return claim;
    }

    public boolean updateClaimStatus(String claimId, String newStatus) {
        for (Claim c : db.getMemoryClaims()) {
            if (c.getId().equals(claimId)) {
                c.setStatus(newStatus);
                c.setReviewedAt(new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'").format(new java.util.Date()));
                return true;
            }
        }
        return false;
    }
}
