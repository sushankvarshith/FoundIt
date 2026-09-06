package server.models;

/**
 * User Entity Model
 * Represents a registered user in the FoundIt community.
 * Maps to the 'users' table in MySQL.
 */
public class User {
    private String id;
    private String name;
    private String username;
    private String email;
    private String password;
    private String phone;
    private String avatar;
    private String bio;
    private String location;
    private String city;
    private int reputationScore;
    private boolean isCommunityHelper;
    private int lostReports;
    private int foundReports;
    private int successfulReturns;
    private int helpfulActions;

    // Default constructor
    public User() {
        this.reputationScore = 95;
        this.isCommunityHelper = true;
    }

    // Parameterized constructor
    public User(String id, String name, String username, String email, String phone, String avatar, String bio, String location, String city) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.email = email;
        this.phone = phone;
        this.avatar = avatar;
        this.bio = bio;
        this.location = location;
        this.city = city;
        this.reputationScore = 95;
        this.isCommunityHelper = true;
        this.lostReports = 2;
        this.foundReports = 5;
        this.successfulReturns = 4;
        this.helpfulActions = 18;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public int getReputationScore() { return reputationScore; }
    public void setReputationScore(int reputationScore) { this.reputationScore = reputationScore; }

    public boolean isCommunityHelper() { return isCommunityHelper; }
    public void setCommunityHelper(boolean communityHelper) { isCommunityHelper = communityHelper; }

    public int getLostReports() { return lostReports; }
    public void setLostReports(int lostReports) { this.lostReports = lostReports; }

    public int getFoundReports() { return foundReports; }
    public void setFoundReports(int foundReports) { this.foundReports = foundReports; }

    public int getSuccessfulReturns() { return successfulReturns; }
    public void setSuccessfulReturns(int successfulReturns) { this.successfulReturns = successfulReturns; }

    public int getHelpfulActions() { return helpfulActions; }
    public void setHelpfulActions(int helpfulActions) { this.helpfulActions = helpfulActions; }
}
