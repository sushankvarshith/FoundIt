-- ============================================================================
-- FoundIt Sample Seed Data
-- Populates users, posts, claims, comments, and notifications
-- ============================================================================

USE foundit_db;

-- ----------------------------------------------------------------------------
-- 1. Insert Initial Users
-- ----------------------------------------------------------------------------
INSERT INTO users (id, name, username, email, password_hash, phone, avatar, bio, location, city, reputation_score, is_community_helper, lost_reports, found_reports, successful_returns, helpful_actions)
VALUES 
('usr_me', 'Arjun Rao', 'arjun_foundit', 'arjun.rao@gmail.com', 'password123', '+91 98765 43210', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'Community volunteer based in Nellore, Andhra Pradesh. Passionate about returning lost belongings to rightful owners.', 'Magunta Layout, Nellore', 'Nellore', 98, 1, 2, 5, 4, 18),
('usr_1', 'Rohan Sharma', 'rohans_99', 'rohan@example.com', 'password123', '+91 98111 22233', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'Software engineer and tech enthusiast in Nellore.', 'VRC Centre, Nellore', 'Nellore', 92, 1, 3, 2, 2, 8),
('usr_2', 'Sneha Reddy', 'sneha_r', 'sneha@example.com', 'password123', '+91 98444 55566', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', 'Architecture student & active community member.', 'Gandhi Nagar, Nellore', 'Nellore', 96, 1, 1, 4, 3, 14),
('usr_3', 'Vikram Varma', 'vikram_v', 'vikram@example.com', 'password123', '+91 98777 88899', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 'Bank manager and weekend cyclist.', 'Pogathota, Nellore', 'Nellore', 89, 0, 1, 2, 1, 5),
('usr_4', 'Priya Deshmukh', 'priya_d', 'priya@example.com', 'password123', '+91 98222 33344', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', 'Teacher at local high school.', 'Dargamitta, Nellore', 'Nellore', 94, 1, 2, 3, 3, 11);

-- ----------------------------------------------------------------------------
-- 2. Insert Initial Items
-- ----------------------------------------------------------------------------
INSERT INTO items (id, type, title, category, brand, model, color, description, identifying_features, images, location_name, city, neighborhood, distance_km, lat, lng, approximate, date_occurred, date_reported, status, has_reward, reward_amount, reward_currency, reward_note, uploader_id, contact_preference, likes_count, comments_count, shares_count)
VALUES
(
  'post_1', 'lost', 'Apple iPhone 15 Pro (Natural Titanium, 256GB)', 'Mobile Phones', 'Apple', 'iPhone 15 Pro', 'Natural Titanium / Gray',
  'Left behind in an auto or fruit juice stall near VRC Centre Clock Tower around 8:30 PM. Has a matte black Spigen case with a tiny green sticker on the lower back. Lock screen shows a landscape photograph.',
  'Matte black Spigen case, small green sticker, slight scratch near speaker grill',
  JSON_ARRAY('https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80'),
  'VRC Centre Clock Tower & Shopping Complex', 'Nellore', 'VRC Centre', 0.8, 14.4445, 79.9872, 1,
  '2 hours ago', '2026-09-05 20:30:00', 'active', 1, 5000.00, '₹', 'Generous cash reward no questions asked, need urgent business data.',
  'usr_1', 'claim_first', 24, 6, 12
),
(
  'post_2', 'found', 'Bellroy Vintage Leather Slim Wallet', 'Wallets', 'Bellroy', 'Hide & Seek Slim', 'Caramel Tan',
  'Found on a stone bench in Children\'s Park near Gandhi Nagar around 5:15 PM. Contains metro card, student ID, and several cards. Safely kept with park security supervisor and can verify ID.',
  'Stitched corner, faint coffee droplet mark near logo embossed stamp',
  JSON_ARRAY('https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80'),
  'Children\'s Park Gandhi Nagar Gate 2', 'Nellore', 'Gandhi Nagar', 1.2, 14.4382, 79.9765, 1,
  'Yesterday afternoon', '2026-09-04 17:15:00', 'active', 0, 0.00, '₹', NULL,
  'usr_2', 'claim_first', 18, 3, 5
),
(
  'post_3', 'lost', 'MacBook Air M2 (Midnight Blue, 13-inch)', 'Laptops', 'Apple', 'MacBook Air M2 2022', 'Midnight Blue',
  'Forgot my laptop sleeve bag at Cafe Coffee Day / Tea Lounge near Trunk Road. Bag is charcoal gray with orange zipper pullers. Crucial research project files inside.',
  'Sticker of NASA Artemis mission and GitHub Octocat on lid',
  JSON_ARRAY('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80'),
  'Trunk Road Central Plaza', 'Nellore', 'Trunk Road', 2.1, 14.4491, 79.9823, 1,
  '1 day ago', '2026-09-04 14:00:00', 'active', 1, 10000.00, '₹', 'Reward offered for safe return with intact SSD/files.',
  'usr_me', 'foundit_chat', 42, 11, 28
),
(
  'post_4', 'found', 'Set of Bike Keys with Royal Enfield Brass Keychain', 'Keys', 'Royal Enfield', 'Classic 350', 'Brass / Silver',
  'Discovered hanging near the billing counter at More Supermarket Pogathota. Has three keys and a circular brass medallion with engraved RE crest.',
  'Small blue rubber ring on the ignition key',
  JSON_ARRAY('https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop&q=80'),
  'More Supermarket Parking Pogathota', 'Nellore', 'Pogathota', 1.5, 14.4412, 79.9898, 1,
  '3 hours ago', '2026-09-05 18:45:00', 'active', 0, 0.00, '₹', NULL,
  'usr_3', 'foundit_chat', 9, 2, 3
),
(
  'post_5', 'lost', 'Golden Retriever Pup (Male, Named Bruno, Red Collar)', 'Pets', 'Golden Retriever', '4 Months Old', 'Golden / Cream',
  'Bruno slipped out of our front garden gate near Magunta Layout 3rd cross street during evening fireworks. He is very friendly, answers to "Bruno", wearing a red nylon collar with a small bell.',
  'Small white patch on his chest, red collar with bell',
  JSON_ARRAY('https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&auto=format&fit=crop&q=80'),
  'Magunta Layout 3rd Cross Street', 'Nellore', 'Magunta Layout', 0.5, 14.4312, 79.9721, 1,
  'Yesterday night', '2026-09-04 21:00:00', 'active', 1, 7500.00, '₹', 'Huge cash reward! Please help us bring our baby home safely.',
  'usr_4', 'claim_first', 87, 19, 64
),
(
  'post_6', 'found', 'Fossil Minimalist Chronograph Watch (Brown Leather)', 'Jewelry', 'Fossil', 'The Minimalist 3H', 'Rose Gold / Brown',
  'Found resting on the sink counter at Nellore Railway Station Waiting Hall (Platform 1). Dial is intact, small scratches on back plate.',
  'Initials S.K. faintly laser etched on back buckle',
  JSON_ARRAY('https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80'),
  'Nellore Railway Station Platform 1', 'Nellore', 'Railway Station Area', 2.8, 14.4561, 79.9921, 1,
  '2 days ago', '2026-09-03 11:20:00', 'active', 0, 0.00, '₹', NULL,
  'usr_2', 'claim_first', 15, 4, 7
),
(
  'post_7', 'lost', 'Samsonite Hard-Shell Cabin Trolley Bag (Navy Blue)', 'Bags', 'Samsonite', 'Omni PC 20"', 'Navy Blue',
  'Accidentally interchanged or forgotten in APSRTC Super Luxury bus from Vijayawada to Nellore, reached RTC Central Bus Stand Nellore around 6:00 AM.',
  'Bright yellow luggage strap with TSA lock combination 842',
  JSON_ARRAY('https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800&auto=format&fit=crop&q=80'),
  'APSRTC Central Bus Station Depot', 'Nellore', 'RTC Complex', 1.9, 14.4485, 79.9798, 1,
  '3 days ago', '2026-09-02 06:30:00', 'submitted', 1, 3000.00, '₹', 'Contains university certificates and personal documents.',
  'usr_1', 'claim_first', 31, 8, 14
),
(
  'post_8', 'found', 'Sony WH-1000XM5 Wireless Headphones (Silver/Off-White)', 'Electronics', 'Sony', 'WH-1000XM5', 'Silver / Off-White',
  'Left on the gym bench at Cult.fit / Gold’s Gym near Dargamitta around 7:30 PM. In original gray protective travel case with aux cable.',
  'Tiny nick on right ear cushion hinge',
  JSON_ARRAY('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'),
  'Fitness Center Dargamitta Main Road', 'Nellore', 'Dargamitta', 1.1, 14.4354, 79.9782, 1,
  '1 day ago', '2026-09-04 19:30:00', 'active', 0, 0.00, '₹', NULL,
  'usr_me', 'foundit_chat', 28, 5, 9
);

-- ----------------------------------------------------------------------------
-- 3. Insert Initial Comments
-- ----------------------------------------------------------------------------
INSERT INTO comments (id, item_id, user_id, comment_text, likes_count)
VALUES
('cmt_1', 'post_1', 'usr_2', 'I saw a similar phone kept at the juice stall cash counter. Have you asked the owner Ramesh?', 4),
('cmt_2', 'post_1', 'usr_1', 'Checked with Ramesh just now, he said someone handed an auto driver a phone! Following up with the auto stand union.', 2),
('cmt_3', 'post_5', 'usr_3', 'Saw a golden pup running near Magunta park gate around 9:30 PM yesterday. Will check morning walk route again!', 8),
('cmt_4', 'post_3', 'usr_2', 'Did you check the CCD CCTV? The manager Mr. Srinivas is usually very helpful.', 3);

-- ----------------------------------------------------------------------------
-- 4. Insert Initial Notifications
-- ----------------------------------------------------------------------------
INSERT INTO notifications (id, user_id, type, title, message, item_id, is_read)
VALUES
('notif_1', 'usr_me', 'match_found', 'Possible Match Near You', 'A Bellroy wallet found in Children\'s Park matches items reported nearby.', 'post_2', 0),
('notif_2', 'usr_me', 'comment', 'New Comment on MacBook Air', 'Sneha Reddy commented on your lost MacBook report.', 'post_3', 0),
('notif_3', 'usr_me', 'claim_received', 'Claim Submitted for Review', 'A user submitted proof of ownership for Sony Headphones.', 'post_8', 1);
