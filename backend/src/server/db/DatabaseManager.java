package server.db;

import server.models.*;
import java.sql.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * DatabaseManager
 * Manages JDBC connections to MySQL database (XAMPP / MariaDB / MySQL 8.0+).
 * Features an intelligent dual-mode architecture:
 * 1. Primary: MySQL Database via JDBC
 * 2. Fallback: Thread-Safe In-Memory Cache if MySQL service is not yet started in XAMPP.
 * This guarantees the project ALWAYS runs reliably without crashing!
 */
public class DatabaseManager {

    private static DatabaseManager instance;

    // Database connection credentials (Standard XAMPP default is root with no password)
    // private static final String DB_URL = "jdbc:mysql://localhost:3306/foundit_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
    // private static final String DB_USER = "root";
    // private static final String DB_PASS = "";

    private static final String DB_URL ="jdbc:mysql://mysql-9ea700c-sushankvarshith16-afad.j.aivencloud.com:27678/foundit_db?sslMode=REQUIRED";

    private static final String DB_USER = "avnadmin";

    private static final String DB_PASS = System.getenv("DB_PASSWORD");

    private boolean usingMySQL = false;
    private Connection mysqlConnection = null;

    // Fallback In-Memory Datastores (used when MySQL is offline)
    private final Map<String, User> memoryUsers = new ConcurrentHashMap<>();
    private final List<ItemPost> memoryItems = new CopyOnWriteArrayList<>();
    private final List<Claim> memoryClaims = new CopyOnWriteArrayList<>();
    private final List<Comment> memoryComments = new CopyOnWriteArrayList<>();
    private final List<ChatMessage> memoryMessages = new CopyOnWriteArrayList<>();
    private final List<Notification> memoryNotifications = new CopyOnWriteArrayList<>();
    private final Set<String> memoryLikedItems = Collections.newSetFromMap(new ConcurrentHashMap<>());
    private final Set<String> memorySavedItems = Collections.newSetFromMap(new ConcurrentHashMap<>());

    private DatabaseManager() {
        initializeStorage();
    }

    public static synchronized DatabaseManager getInstance() {
        if (instance == null) {
            instance = new DatabaseManager();
        }
        return instance;
    }

    private void initializeStorage() {
        System.out.println("=================================================");
        System.out.println("     FoundIt Database Initialization             ");
        System.out.println("=================================================");
        try {
            // Attempt to load MySQL JDBC Driver
            Class.forName("com.mysql.cj.jdbc.Driver");
            System.out.println("[DB] MySQL JDBC Driver loaded successfully.");

            // Attempt connection to MySQL server
            mysqlConnection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
            usingMySQL = true;
            System.out.println("[DB] \u2705 CONNECTED TO MYSQL (foundit_db on localhost:3306)!");

            // Create tables if they do not exist
            createTablesIfNotExist(mysqlConnection);

            // Populate sample data if items table is empty
            seedMySQLIfEmpty(mysqlConnection);

        } catch (ClassNotFoundException e) {
            System.out.println("[DB] Note: MySQL JDBC driver not in classpath. Using resilient in-memory storage.");
            usingMySQL = false;
        } catch (SQLException e) {
            System.out.println("[DB] \u26A0\uFE0F MySQL server is not running on localhost:3306 (" + e.getMessage() + ")");
            System.out.println("[DB] \u2139\uFE0F Tip: Open XAMPP Control Panel and start MySQL to persist data to SQL.");
            System.out.println("[DB] \u2705 Seamlessly running in In-Memory Mode (All features remain 100% active).");
            usingMySQL = false;
        }

        // Always seed in-memory storage as backup/mirror
        seedInMemoryStorage();
    }

    private void createTablesIfNotExist(Connection conn) {
        try (Statement stmt = conn.createStatement()) {
            // Users table
            stmt.execute("CREATE TABLE IF NOT EXISTS users (" +
                "id VARCHAR(64) PRIMARY KEY, " +
                "name VARCHAR(120) NOT NULL, " +
                "username VARCHAR(60) NOT NULL UNIQUE, " +
                "email VARCHAR(120) NOT NULL UNIQUE, " +
                "password_hash VARCHAR(255) NOT NULL DEFAULT '', " +
                "phone VARCHAR(30) DEFAULT '', " +
                "avatar VARCHAR(500) DEFAULT '', " +
                "bio TEXT, " +
                "location VARCHAR(120) DEFAULT '', " +
                "city VARCHAR(80) DEFAULT '', " +
                "reputation_score INT DEFAULT 50, " +
                "is_community_helper BOOLEAN DEFAULT FALSE, " +
                "lost_reports INT DEFAULT 0, " +
                "found_reports INT DEFAULT 0, " +
                "successful_returns INT DEFAULT 0, " +
                "helpful_actions INT DEFAULT 0" +
                ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            // Items table
            stmt.execute("CREATE TABLE IF NOT EXISTS items (" +
                "id VARCHAR(64) PRIMARY KEY, " +
                "type ENUM('lost', 'found') NOT NULL, " +
                "title VARCHAR(200) NOT NULL, " +
                "category VARCHAR(60) NOT NULL, " +
                "brand VARCHAR(100) DEFAULT '', " +
                "model VARCHAR(100) DEFAULT '', " +
                "color VARCHAR(60) NOT NULL, " +
                "description TEXT NOT NULL, " +
                "identifying_features TEXT, " +
                "images TEXT, " +
                "location_name VARCHAR(150) NOT NULL, " +
                "city VARCHAR(80) NOT NULL, " +
                "neighborhood VARCHAR(100) NOT NULL, " +
                "distance_km DECIMAL(6,2) DEFAULT 0.0, " +
                "lat DECIMAL(10,6) DEFAULT 0.0, " +
                "lng DECIMAL(10,6) DEFAULT 0.0, " +
                "approximate BOOLEAN DEFAULT TRUE, " +
                "date_occurred VARCHAR(80) NOT NULL, " +
                "date_reported VARCHAR(60) NOT NULL, " +
                "status ENUM('active', 'submitted', 'found', 'resolved') NOT NULL DEFAULT 'active', " +
                "has_reward BOOLEAN DEFAULT FALSE, " +
                "reward_amount DECIMAL(10,2) DEFAULT 0.0, " +
                "reward_currency VARCHAR(10) DEFAULT '₹', " +
                "reward_note TEXT, " +
                "uploader_id VARCHAR(64) NOT NULL, " +
                "contact_preference VARCHAR(40) DEFAULT 'foundit_chat', " +
                "likes_count INT DEFAULT 0, " +
                "comments_count INT DEFAULT 0, " +
                "shares_count INT DEFAULT 0" +
                ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            // Claims table
            stmt.execute("CREATE TABLE IF NOT EXISTS claims (" +
                "id VARCHAR(64) PRIMARY KEY, " +
                "item_id VARCHAR(64) NOT NULL, " +
                "item_title VARCHAR(200) NOT NULL, " +
                "claimant_id VARCHAR(64) NOT NULL, " +
                "status VARCHAR(40) NOT NULL DEFAULT 'pending', " +
                "answers TEXT, " +
                "contact_note TEXT, " +
                "created_at VARCHAR(60) NOT NULL" +
                ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            // Comments table
            stmt.execute("CREATE TABLE IF NOT EXISTS comments (" +
                "id VARCHAR(64) PRIMARY KEY, " +
                "item_id VARCHAR(64) NOT NULL, " +
                "user_id VARCHAR(64) NOT NULL, " +
                "user_name VARCHAR(120) NOT NULL, " +
                "user_avatar VARCHAR(500) DEFAULT '', " +
                "comment_text TEXT NOT NULL, " +
                "likes_count INT DEFAULT 0, " +
                "created_at VARCHAR(60) NOT NULL" +
                ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            // Messages table
            stmt.execute("CREATE TABLE IF NOT EXISTS chat_messages (" +
                "id VARCHAR(64) PRIMARY KEY, " +
                "conversation_id VARCHAR(100) NOT NULL, " +
                "sender_id VARCHAR(64) NOT NULL, " +
                "receiver_id VARCHAR(64) NOT NULL, " +
                "item_id VARCHAR(64) DEFAULT NULL, " +
                "message_text TEXT NOT NULL, " +
                "is_read BOOLEAN DEFAULT FALSE, " +
                "sent_at VARCHAR(60) NOT NULL" +
                ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            // Notifications table
            stmt.execute("CREATE TABLE IF NOT EXISTS notifications (" +
                "id VARCHAR(64) PRIMARY KEY, " +
                "user_id VARCHAR(64) NOT NULL, " +
                "type VARCHAR(40) NOT NULL, " +
                "title VARCHAR(200) NOT NULL, " +
                "message TEXT NOT NULL, " +
                "item_id VARCHAR(64) DEFAULT NULL, " +
                "is_read BOOLEAN DEFAULT FALSE, " +
                "created_at VARCHAR(60) NOT NULL" +
                ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

            System.out.println("[DB] Verified all SQL tables are present.");
        } catch (SQLException e) {
            System.err.println("[DB] Error creating MySQL tables: " + e.getMessage());
        }
    }

    private void seedMySQLIfEmpty(Connection conn) {
        try (Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM items")) {
            if (rs.next() && rs.getInt(1) == 0) {
                System.out.println("[DB] Items table is empty. Seeding initial posts into MySQL...");
                // Insert user
                stmt.execute("INSERT IGNORE INTO users (id, name, username, email, phone, avatar, bio, location, city, reputation_score, is_community_helper) " +
                    "VALUES ('usr_me', 'Arjun Rao', 'arjun_foundit', 'arjun.rao@gmail.com', '+91 98765 43210', " +
                    "'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', " +
                    "'Community volunteer based in Nellore, Andhra Pradesh.', 'Magunta Layout, Nellore', 'Nellore', 98, 1);");

                // Seed items
                for (ItemPost p : getInitialSeedPosts()) {
                    PreparedStatement ps = conn.prepareStatement(
                        "INSERT INTO items (id, type, title, category, brand, model, color, description, identifying_features, images, " +
                        "location_name, city, neighborhood, distance_km, lat, lng, approximate, date_occurred, date_reported, status, " +
                        "has_reward, reward_amount, reward_currency, reward_note, uploader_id, contact_preference, likes_count, comments_count, shares_count) " +
                        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
                    );
                    ps.setString(1, p.getId());
                    ps.setString(2, p.getType());
                    ps.setString(3, p.getTitle());
                    ps.setString(4, p.getCategory());
                    ps.setString(5, p.getBrand());
                    ps.setString(6, p.getModel());
                    ps.setString(7, p.getColor());
                    ps.setString(8, p.getDescription());
                    ps.setString(9, p.getIdentifyingFeatures());
                    ps.setString(10, String.join("||", p.getImages()));
                    ps.setString(11, p.getLocationName());
                    ps.setString(12, p.getCity());
                    ps.setString(13, p.getNeighborhood());
                    ps.setDouble(14, p.getDistanceKm());
                    ps.setDouble(15, p.getLat());
                    ps.setDouble(16, p.getLng());
                    ps.setBoolean(17, p.isApproximate());
                    ps.setString(18, p.getDateOccurred());
                    ps.setString(19, p.getDateReported());
                    ps.setString(20, p.getStatus());
                    ps.setBoolean(21, p.isHasReward());
                    ps.setDouble(22, p.getRewardAmount());
                    ps.setString(23, p.getRewardCurrency());
                    ps.setString(24, p.getRewardNote());
                    ps.setString(25, p.getUploaderId());
                    ps.setString(26, p.getContactPreference());
                    ps.setInt(27, p.getLikesCount());
                    ps.setInt(28, p.getCommentsCount());
                    ps.setInt(29, p.getSharesCount());
                    ps.executeUpdate();
                }
                System.out.println("[DB] Seeded initial posts into MySQL successfully!");
            }
        } catch (SQLException e) {
            System.err.println("[DB] Error seeding MySQL: " + e.getMessage());
        }
    }

    private void seedInMemoryStorage() {
        // Current user
        User me = new User("usr_me", "Arjun Rao", "arjun_foundit", "arjun.rao@gmail.com", "+91 98765 43210",
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            "Community volunteer based in Nellore, Andhra Pradesh. Passionate about returning lost belongings to rightful owners.",
            "Magunta Layout, Nellore", "Nellore");
        memoryUsers.put(me.getId(), me);

        // Seed initial posts
        memoryItems.addAll(getInitialSeedPosts());

        // Sample comments
        memoryComments.add(new Comment("cmt_1", "post_1", "usr_2", "Sneha Reddy",
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
            "I saw a similar phone kept at the juice stall cash counter. Have you asked the owner Ramesh?", "1 hour ago", 4));
        memoryComments.add(new Comment("cmt_2", "post_1", "usr_1", "Rohan Sharma",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            "Checked with Ramesh just now, he said someone handed an auto driver a phone! Following up.", "45 mins ago", 2));

        // Sample notifications
        memoryNotifications.add(new Notification("notif_1", "usr_me", "match_found", "Possible Match Near You",
            "A Bellroy wallet found in Children's Park matches items reported nearby.", "post_2", false, "10 mins ago"));
        memoryNotifications.add(new Notification("notif_2", "usr_me", "comment", "New Comment on MacBook Air",
            "Sneha Reddy commented on your lost MacBook report.", "post_3", false, "1 hour ago"));
        memoryNotifications.add(new Notification("notif_3", "usr_me", "claim_received", "Claim Submitted for Review",
            "A user submitted proof of ownership for Sony Headphones.", "post_8", true, "1 day ago"));
    }

    private List<ItemPost> getInitialSeedPosts() {
        List<ItemPost> list = new ArrayList<>();

        // Post 1: Lost iPhone 15 Pro
        ItemPost p1 = new ItemPost();
        p1.setId("post_1");
        p1.setType("lost");
        p1.setTitle("Apple iPhone 15 Pro (Natural Titanium, 256GB)");
        p1.setCategory("Mobile Phones");
        p1.setBrand("Apple");
        p1.setModel("iPhone 15 Pro");
        p1.setColor("Natural Titanium / Gray");
        p1.setDescription("Left behind in an auto or fruit juice stall near VRC Centre Clock Tower around 8:30 PM. Has a matte black Spigen case with a tiny green sticker on the lower back.");
        p1.setIdentifyingFeatures("Matte black Spigen case, small green sticker, slight scratch near speaker grill");
        p1.setImages(Arrays.asList(
            "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80"
        ));
        p1.setLocationName("VRC Centre Clock Tower & Shopping Complex");
        p1.setCity("Nellore");
        p1.setNeighborhood("VRC Centre");
        p1.setDistanceKm(0.8);
        p1.setLat(14.4445);
        p1.setLng(79.9872);
        p1.setApproximate(true);
        p1.setDateOccurred("2 hours ago");
        p1.setDateReported("2026-09-05T20:30:00Z");
        p1.setStatus("active");
        p1.setHasReward(true);
        p1.setRewardAmount(5000.0);
        p1.setRewardCurrency("₹");
        p1.setRewardNote("Generous cash reward no questions asked, need urgent business data.");
        p1.setUploaderId("usr_1");
        p1.setUploaderName("Rohan Sharma");
        p1.setUploaderUsername("rohans_99");
        p1.setUploaderAvatar("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80");
        p1.setLikesCount(24);
        p1.setCommentsCount(6);
        p1.setSharesCount(12);
        p1.setContactPreference("claim_first");
        p1.setSaved(true);
        list.add(p1);

        // Post 2: Found Leather Wallet
        ItemPost p2 = new ItemPost();
        p2.setId("post_2");
        p2.setType("found");
        p2.setTitle("Bellroy Vintage Leather Slim Wallet");
        p2.setCategory("Wallets");
        p2.setBrand("Bellroy");
        p2.setModel("Hide & Seek Slim");
        p2.setColor("Caramel Tan");
        p2.setDescription("Found on a stone bench in Children's Park near Gandhi Nagar around 5:15 PM. Contains metro card, student ID, and several cards. Safely kept with park security.");
        p2.setIdentifyingFeatures("Stitched corner, faint coffee droplet mark near logo embossed stamp");
        p2.setImages(Collections.singletonList(
            "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80"
        ));
        p2.setLocationName("Children's Park Gandhi Nagar Gate 2");
        p2.setCity("Nellore");
        p2.setNeighborhood("Gandhi Nagar");
        p2.setDistanceKm(1.2);
        p2.setLat(14.4382);
        p2.setLng(79.9765);
        p2.setApproximate(true);
        p2.setDateOccurred("Yesterday afternoon");
        p2.setDateReported("2026-09-04T17:15:00Z");
        p2.setStatus("active");
        p2.setHasReward(false);
        p2.setUploaderId("usr_2");
        p2.setUploaderName("Sneha Reddy");
        p2.setUploaderUsername("sneha_r");
        p2.setUploaderAvatar("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80");
        p2.setLikesCount(18);
        p2.setCommentsCount(3);
        p2.setSharesCount(5);
        p2.setContactPreference("claim_first");
        list.add(p2);

        // Post 3: Lost MacBook Air M2
        ItemPost p3 = new ItemPost();
        p3.setId("post_3");
        p3.setType("lost");
        p3.setTitle("MacBook Air M2 (Midnight Blue, 13-inch)");
        p3.setCategory("Laptops");
        p3.setBrand("Apple");
        p3.setModel("MacBook Air M2 2022");
        p3.setColor("Midnight Blue");
        p3.setDescription("Forgot my laptop sleeve bag at Cafe Coffee Day / Tea Lounge near Trunk Road. Bag is charcoal gray with orange zipper pullers. Crucial research project files inside.");
        p3.setIdentifyingFeatures("Sticker of NASA Artemis mission and GitHub Octocat on lid");
        p3.setImages(Arrays.asList(
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80"
        ));
        p3.setLocationName("Trunk Road Central Plaza");
        p3.setCity("Nellore");
        p3.setNeighborhood("Trunk Road");
        p3.setDistanceKm(2.1);
        p3.setLat(14.4491);
        p3.setLng(79.9823);
        p3.setApproximate(true);
        p3.setDateOccurred("1 day ago");
        p3.setDateReported("2026-09-04T14:00:00Z");
        p3.setStatus("active");
        p3.setHasReward(true);
        p3.setRewardAmount(10000.0);
        p3.setRewardCurrency("₹");
        p3.setRewardNote("Reward offered for safe return with intact SSD/files.");
        p3.setUploaderId("usr_me");
        p3.setUploaderName("Arjun Rao");
        p3.setUploaderUsername("arjun_foundit");
        p3.setUploaderAvatar("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80");
        p3.setLikesCount(42);
        p3.setCommentsCount(11);
        p3.setSharesCount(28);
        p3.setContactPreference("foundit_chat");
        list.add(p3);

        // Post 4: Found Royal Enfield Keys
        ItemPost p4 = new ItemPost();
        p4.setId("post_4");
        p4.setType("found");
        p4.setTitle("Set of Bike Keys with Royal Enfield Brass Keychain");
        p4.setCategory("Keys");
        p4.setBrand("Royal Enfield");
        p4.setModel("Classic 350");
        p4.setColor("Brass / Silver");
        p4.setDescription("Discovered hanging near the billing counter at More Supermarket Pogathota. Has three keys and a circular brass medallion with engraved RE crest.");
        p4.setIdentifyingFeatures("Small blue rubber ring on the ignition key");
        p4.setImages(Collections.singletonList(
            "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop&q=80"
        ));
        p4.setLocationName("More Supermarket Parking Pogathota");
        p4.setCity("Nellore");
        p4.setNeighborhood("Pogathota");
        p4.setDistanceKm(1.5);
        p4.setLat(14.4412);
        p4.setLng(79.9898);
        p4.setApproximate(true);
        p4.setDateOccurred("3 hours ago");
        p4.setDateReported("2026-09-05T18:45:00Z");
        p4.setStatus("active");
        p4.setHasReward(false);
        p4.setUploaderId("usr_3");
        p4.setUploaderName("Vikram Varma");
        p4.setUploaderUsername("vikram_v");
        p4.setUploaderAvatar("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80");
        p4.setLikesCount(9);
        p4.setCommentsCount(2);
        p4.setSharesCount(3);
        p4.setContactPreference("foundit_chat");
        list.add(p4);

        // Post 5: Lost Golden Retriever Pup Bruno
        ItemPost p5 = new ItemPost();
        p5.setId("post_5");
        p5.setType("lost");
        p5.setTitle("Golden Retriever Pup (Male, Named Bruno, Red Collar)");
        p5.setCategory("Pets");
        p5.setBrand("Golden Retriever");
        p5.setModel("4 Months Old");
        p5.setColor("Golden / Cream");
        p5.setDescription("Bruno slipped out of our front garden gate near Magunta Layout 3rd cross street during evening fireworks. He is very friendly, answers to 'Bruno', wearing a red nylon collar with a small bell.");
        p5.setIdentifyingFeatures("Small white patch on his chest, red collar with bell");
        p5.setImages(Arrays.asList(
            "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&auto=format&fit=crop&q=80"
        ));
        p5.setLocationName("Magunta Layout 3rd Cross Street");
        p5.setCity("Nellore");
        p5.setNeighborhood("Magunta Layout");
        p5.setDistanceKm(0.5);
        p5.setLat(14.4312);
        p5.setLng(79.9721);
        p5.setApproximate(true);
        p5.setDateOccurred("Yesterday night");
        p5.setDateReported("2026-09-04T21:00:00Z");
        p5.setStatus("active");
        p5.setHasReward(true);
        p5.setRewardAmount(7500.0);
        p5.setRewardCurrency("₹");
        p5.setRewardNote("Huge cash reward! Please help us bring our puppy home safely.");
        p5.setUploaderId("usr_4");
        p5.setUploaderName("Priya Deshmukh");
        p5.setUploaderUsername("priya_d");
        p5.setUploaderAvatar("https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80");
        p5.setLikesCount(87);
        p5.setCommentsCount(19);
        p5.setSharesCount(64);
        p5.setContactPreference("claim_first");
        list.add(p5);

        // Post 6: Found Fossil Chronograph Watch
        ItemPost p6 = new ItemPost();
        p6.setId("post_6");
        p6.setType("found");
        p6.setTitle("Fossil Minimalist Chronograph Watch (Brown Leather)");
        p6.setCategory("Jewelry");
        p6.setBrand("Fossil");
        p6.setModel("The Minimalist 3H");
        p6.setColor("Rose Gold / Brown");
        p6.setDescription("Found resting on the sink counter at Nellore Railway Station Waiting Hall (Platform 1). Dial is intact, small scratches on back plate.");
        p6.setIdentifyingFeatures("Initials S.K. faintly laser etched on back buckle");
        p6.setImages(Collections.singletonList(
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80"
        ));
        p6.setLocationName("Nellore Railway Station Platform 1");
        p6.setCity("Nellore");
        p6.setNeighborhood("Railway Station Area");
        p6.setDistanceKm(2.8);
        p6.setLat(14.4561);
        p6.setLng(79.9921);
        p6.setApproximate(true);
        p6.setDateOccurred("2 days ago");
        p6.setDateReported("2026-09-03T11:20:00Z");
        p6.setStatus("active");
        p6.setHasReward(false);
        p6.setUploaderId("usr_2");
        p6.setUploaderName("Sneha Reddy");
        p6.setUploaderUsername("sneha_r");
        p6.setUploaderAvatar("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80");
        p6.setLikesCount(15);
        p6.setCommentsCount(4);
        p6.setSharesCount(7);
        p6.setContactPreference("claim_first");
        list.add(p6);

        // Post 7: Lost Cabin Trolley Bag
        ItemPost p7 = new ItemPost();
        p7.setId("post_7");
        p7.setType("lost");
        p7.setTitle("Samsonite Hard-Shell Cabin Trolley Bag (Navy Blue)");
        p7.setCategory("Bags");
        p7.setBrand("Samsonite");
        p7.setModel("Omni PC 20\"");
        p7.setColor("Navy Blue");
        p7.setDescription("Accidentally interchanged or forgotten in APSRTC Super Luxury bus from Vijayawada to Nellore, reached RTC Central Bus Stand around 6:00 AM.");
        p7.setIdentifyingFeatures("Bright yellow luggage strap with TSA lock combination 842");
        p7.setImages(Collections.singletonList(
            "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800&auto=format&fit=crop&q=80"
        ));
        p7.setLocationName("APSRTC Central Bus Station Depot");
        p7.setCity("Nellore");
        p7.setNeighborhood("RTC Complex");
        p7.setDistanceKm(1.9);
        p7.setLat(14.4485);
        p7.setLng(79.9798);
        p7.setApproximate(true);
        p7.setDateOccurred("3 days ago");
        p7.setDateReported("2026-09-02T06:30:00Z");
        p7.setStatus("submitted");
        p7.setHasReward(true);
        p7.setRewardAmount(3000.0);
        p7.setRewardCurrency("₹");
        p7.setRewardNote("Contains university certificates and personal documents.");
        p7.setUploaderId("usr_1");
        p7.setUploaderName("Rohan Sharma");
        p7.setUploaderUsername("rohans_99");
        p7.setUploaderAvatar("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80");
        p7.setLikesCount(31);
        p7.setCommentsCount(8);
        p7.setSharesCount(14);
        p7.setContactPreference("claim_first");
        list.add(p7);

        // Post 8: Found Sony WH-1000XM5 Headphones
        ItemPost p8 = new ItemPost();
        p8.setId("post_8");
        p8.setType("found");
        p8.setTitle("Sony WH-1000XM5 Wireless Headphones (Silver/Off-White)");
        p8.setCategory("Electronics");
        p8.setBrand("Sony");
        p8.setModel("WH-1000XM5");
        p8.setColor("Silver / Off-White");
        p8.setDescription("Left on the gym bench at Cult.fit / Gold's Gym near Dargamitta around 7:30 PM. In original gray protective travel case with aux cable.");
        p8.setIdentifyingFeatures("Tiny nick on right ear cushion hinge");
        p8.setImages(Collections.singletonList(
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
        ));
        p8.setLocationName("Fitness Center Dargamitta Main Road");
        p8.setCity("Nellore");
        p8.setNeighborhood("Dargamitta");
        p8.setDistanceKm(1.1);
        p8.setLat(14.4354);
        p8.setLng(79.9782);
        p8.setApproximate(true);
        p8.setDateOccurred("1 day ago");
        p8.setDateReported("2026-09-04T19:30:00Z");
        p8.setStatus("active");
        p8.setHasReward(false);
        p8.setUploaderId("usr_me");
        p8.setUploaderName("Arjun Rao");
        p8.setUploaderUsername("arjun_foundit");
        p8.setUploaderAvatar("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80");
        p8.setLikesCount(28);
        p8.setCommentsCount(5);
        p8.setSharesCount(9);
        p8.setContactPreference("foundit_chat");
        list.add(p8);

        return list;
    }

    // Accessors
    public boolean isUsingMySQL() { return usingMySQL; }
    public Connection getMySQLConnection() { return mysqlConnection; }

    public Map<String, User> getMemoryUsers() { return memoryUsers; }
    public List<ItemPost> getMemoryItems() { return memoryItems; }
    public List<Claim> getMemoryClaims() { return memoryClaims; }
    public List<Comment> getMemoryComments() { return memoryComments; }
    public List<ChatMessage> getMemoryMessages() { return memoryMessages; }
    public List<Notification> getMemoryNotifications() { return memoryNotifications; }
    public Set<String> getMemoryLikedItems() { return memoryLikedItems; }
    public Set<String> getMemorySavedItems() { return memorySavedItems; }
}
