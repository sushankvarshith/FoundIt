package server.models;

import java.util.ArrayList;
import java.util.List;

/**
 * ItemPost Entity Model
 * Represents a Lost or Found item posted on FoundIt.
 * Maps to the 'items' table in MySQL.
 */
public class ItemPost {
    private String id;
    private String type;               // "lost" or "found"
    private String title;
    private String category;
    private String brand;
    private String model;
    private String color;
    private String description;
    private String identifyingFeatures;
    private List<String> images = new ArrayList<>();
    
    // Location attributes
    private String locationName;
    private String city;
    private String neighborhood;
    private double distanceKm;
    private double lat;
    private double lng;
    private boolean approximate = true;
    
    // Dates & Status
    private String dateOccurred;
    private String dateReported;
    private String status;              // "active", "submitted", "found", "resolved"
    
    // Reward information
    private boolean hasReward;
    private double rewardAmount;
    private String rewardCurrency = "₹";
    private String rewardNote;
    
    // Uploader summary
    private String uploaderId;
    private String uploaderName;
    private String uploaderUsername;
    private String uploaderAvatar;
    
    // Engagement stats
    private int likesCount;
    private int commentsCount;
    private int sharesCount;
    private String contactPreference = "foundit_chat"; // "foundit_chat" or "claim_first"
    
    // User interaction flags (per session)
    private boolean isLiked;
    private boolean isSaved;

    public ItemPost() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIdentifyingFeatures() { return identifyingFeatures; }
    public void setIdentifyingFeatures(String identifyingFeatures) { this.identifyingFeatures = identifyingFeatures; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }

    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getNeighborhood() { return neighborhood; }
    public void setNeighborhood(String neighborhood) { this.neighborhood = neighborhood; }

    public double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(double distanceKm) { this.distanceKm = distanceKm; }

    public double getLat() { return lat; }
    public void setLat(double lat) { this.lat = lat; }

    public double getLng() { return lng; }
    public void setLng(double lng) { this.lng = lng; }

    public boolean isApproximate() { return approximate; }
    public void setApproximate(boolean approximate) { this.approximate = approximate; }

    public String getDateOccurred() { return dateOccurred; }
    public void setDateOccurred(String dateOccurred) { this.dateOccurred = dateOccurred; }

    public String getDateReported() { return dateReported; }
    public void setDateReported(String dateReported) { this.dateReported = dateReported; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isHasReward() { return hasReward; }
    public void setHasReward(boolean hasReward) { this.hasReward = hasReward; }

    public double getRewardAmount() { return rewardAmount; }
    public void setRewardAmount(double rewardAmount) { this.rewardAmount = rewardAmount; }

    public String getRewardCurrency() { return rewardCurrency; }
    public void setRewardCurrency(String rewardCurrency) { this.rewardCurrency = rewardCurrency; }

    public String getRewardNote() { return rewardNote; }
    public void setRewardNote(String rewardNote) { this.rewardNote = rewardNote; }

    public String getUploaderId() { return uploaderId; }
    public void setUploaderId(String uploaderId) { this.uploaderId = uploaderId; }

    public String getUploaderName() { return uploaderName; }
    public void setUploaderName(String uploaderName) { this.uploaderName = uploaderName; }

    public String getUploaderUsername() { return uploaderUsername; }
    public void setUploaderUsername(String uploaderUsername) { this.uploaderUsername = uploaderUsername; }

    public String getUploaderAvatar() { return uploaderAvatar; }
    public void setUploaderAvatar(String uploaderAvatar) { this.uploaderAvatar = uploaderAvatar; }

    public int getLikesCount() { return likesCount; }
    public void setLikesCount(int likesCount) { this.likesCount = likesCount; }

    public int getCommentsCount() { return commentsCount; }
    public void setCommentsCount(int commentsCount) { this.commentsCount = commentsCount; }

    public int getSharesCount() { return sharesCount; }
    public void setSharesCount(int sharesCount) { this.sharesCount = sharesCount; }

    public String getContactPreference() { return contactPreference; }
    public void setContactPreference(String contactPreference) { this.contactPreference = contactPreference; }

    public boolean isLiked() { return isLiked; }
    public void setLiked(boolean liked) { isLiked = liked; }

    public boolean isSaved() { return isSaved; }
    public void setSaved(boolean saved) { isSaved = saved; }
}
