-- ============================================================================
-- FoundIt Database Schema
-- DBMS: MySQL / MariaDB (Compatible with XAMPP, MySQL 8.0+, MariaDB 10.4+)
-- Database: foundit_db
-- ============================================================================

CREATE DATABASE IF NOT EXISTS foundit_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE foundit_db;

-- ----------------------------------------------------------------------------
-- Table 1: users
-- Stores registered user profiles, authentication info, and reputation stats
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    username VARCHAR(60) NOT NULL UNIQUE,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL DEFAULT '',
    phone VARCHAR(30) DEFAULT '',
    avatar VARCHAR(500) DEFAULT '',
    bio TEXT,
    location VARCHAR(120) DEFAULT '',
    city VARCHAR(80) DEFAULT '',
    reputation_score INT DEFAULT 50,
    is_community_helper BOOLEAN DEFAULT FALSE,
    lost_reports INT DEFAULT 0,
    found_reports INT DEFAULT 0,
    successful_returns INT DEFAULT 0,
    helpful_actions INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- Table 2: items
-- Stores lost and found posts reported by community members
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS items (
    id VARCHAR(64) PRIMARY KEY,
    type ENUM('lost', 'found') NOT NULL,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(60) NOT NULL,
    brand VARCHAR(100) DEFAULT '',
    model VARCHAR(100) DEFAULT '',
    color VARCHAR(60) NOT NULL,
    description TEXT NOT NULL,
    identifying_features TEXT,
    images JSON,                         -- Array of image URLs stored as JSON
    location_name VARCHAR(150) NOT NULL,
    city VARCHAR(80) NOT NULL,
    neighborhood VARCHAR(100) NOT NULL,
    distance_km DECIMAL(6,2) DEFAULT 0.0,
    lat DECIMAL(10,6) DEFAULT 0.0,
    lng DECIMAL(10,6) DEFAULT 0.0,
    approximate BOOLEAN DEFAULT TRUE,
    date_occurred VARCHAR(80) NOT NULL,  -- e.g. "2 hours ago" or date string
    date_reported DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'submitted', 'found', 'resolved') NOT NULL DEFAULT 'active',
    has_reward BOOLEAN DEFAULT FALSE,
    reward_amount DECIMAL(10,2) DEFAULT 0.0,
    reward_currency VARCHAR(10) DEFAULT '₹',
    reward_note TEXT,
    uploader_id VARCHAR(64) NOT NULL,
    contact_preference ENUM('foundit_chat', 'claim_first') DEFAULT 'foundit_chat',
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    shares_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_items_type (type),
    INDEX idx_items_category (category),
    INDEX idx_items_status (status),
    INDEX idx_items_city (city),
    INDEX idx_items_uploader (uploader_id),
    CONSTRAINT fk_items_uploader FOREIGN KEY (uploader_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- Table 3: user_interactions
-- Tracks which items each user has liked or saved/bookmarked
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_interactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    item_id VARCHAR(64) NOT NULL,
    interaction_type ENUM('like', 'save') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_item_interaction (user_id, item_id, interaction_type),
    CONSTRAINT fk_interactions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_interactions_item FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- Table 4: claims
-- Tracks "I Think This Is Mine" or "I Found This" claim verification forms
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS claims (
    id VARCHAR(64) PRIMARY KEY,
    item_id VARCHAR(64) NOT NULL,
    claimant_id VARCHAR(64) NOT NULL,
    status ENUM('pending', 'under_review', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
    answers JSON,                       -- Security verification Q&A stored as JSON
    contact_note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at DATETIME DEFAULT NULL,
    INDEX idx_claims_item (item_id),
    INDEX idx_claims_claimant (claimant_id),
    CONSTRAINT fk_claims_item FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    CONSTRAINT fk_claims_claimant FOREIGN KEY (claimant_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- Table 5: comments
-- Comments and helpful tips posted under lost/found items
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS comments (
    id VARCHAR(64) PRIMARY KEY,
    item_id VARCHAR(64) NOT NULL,
    user_id VARCHAR(64) NOT NULL,
    comment_text TEXT NOT NULL,
    likes_count INT DEFAULT 0,
    parent_comment_id VARCHAR(64) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_comments_item (item_id),
    CONSTRAINT fk_comments_item FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- Table 6: chat_messages
-- Direct secure messages exchanged between finders and owners
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS chat_messages (
    id VARCHAR(64) PRIMARY KEY,
    conversation_id VARCHAR(100) NOT NULL,
    sender_id VARCHAR(64) NOT NULL,
    receiver_id VARCHAR(64) NOT NULL,
    item_id VARCHAR(64) DEFAULT NULL,
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_messages_conversation (conversation_id),
    INDEX idx_messages_sender (sender_id),
    INDEX idx_messages_receiver (receiver_id),
    CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_messages_receiver FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- Table 7: notifications
-- Real-time notifications for likes, comments, matches, and claim status
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    type VARCHAR(40) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    item_id VARCHAR(64) DEFAULT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_notifications_user (user_id),
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
