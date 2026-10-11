-- 1. Seed Users (Admin & Customer)
INSERT INTO users (name, email, password_hash, phone, role) VALUES
('Avyara Master Admin', 'admin@avyara.com', '$2a$10$wH1sA8K6E1B6X9dOq7m9ceR1Nf2y3f9.zL4uA4h4yZtQ5fR1W9v0y', '+91 98765 00000', 'admin'),
('Ananya Sharma', 'ananya.sharma@example.com', '$2a$10$wH1sA8K6E1B6X9dOq7m9ceR1Nf2y3f9.zL4uA4h4yZtQ5fR1W9v0y', '+91 98765 43210', 'customer');

-- 2. Seed Categories
INSERT INTO categories (id, name, slug, description, image_url, display_order) VALUES
('11111111-1111-1111-1111-111111111111', 'Kurta Sets', 'kurta-sets', 'Bespoke hand-embroidered and pure cotton kurta sets with dupattas.', '/images/ethnic_kurta_set_1789624822973.jpg', 1),
('22222222-2222-2222-2222-222222222222', 'Sarees', 'sarees', 'Timeless handwoven silk, organza, and festive sarees.', '/images/ethnic_saree_1789624840596.jpg', 2),
('33333333-3333-3333-3333-333333333333', 'Lehengas', 'lehengas', 'Statement bridal, festive, and bridesmaid lehengas.', '/images/ethnic_lehenga_1789624855314.jpg', 3),
('44444444-4444-4444-4444-444444444444', 'Anarkalis', 'anarkalis', 'Regal flared Anarkali suits with ornate dupattas.', '/images/ethnic_anarkali_1789624868513.jpg', 4),
('55555555-5555-5555-5555-555555555555', 'Palazzo Suits', 'palazzo-suits', 'Effortless breezy palazzo suits for all-day comfort and elegance.', '/images/ethnic_palazzo_suit_1789624892265.jpg', 5),
('66666666-6666-6666-6666-666666666666', 'Sharara Sets', 'sharara-sets', 'Glamorous tiered sharara sets with intricate embroidery.', '/images/ethnic_sharara_1789624905126.jpg', 6),
('77777777-7777-7777-7777-777777777777', 'Indo-Western', 'indo-western', 'Contemporary fusion silhouettes, capes, dhoti sets, and asymmetric cuts.', '/images/ethnic_fusion_wear_1789624920412.jpg', 7),
('88888888-8888-8888-8888-888888888888', 'Gowns', 'gowns', 'Floor-length ethnic gowns designed for evening soirees.', '/images/ethnic_gown_1789624931377.jpg', 8),
('99999999-9999-9999-9999-999999999999', 'Dupattas', 'dupattas', 'Artisanal Banarasi, Phulkari, and Kalamkari statement dupattas.', '/images/generated_saree_2.svg', 9);

-- 3. Seed Products
INSERT INTO products (id, title, slug, category_id, price, original_price, discount_percentage, tag, description, material_and_care, shipping_and_returns, fabric, style, color, is_featured, is_active) VALUES
('a0000001-0000-0000-0000-000000000001', 'Floral Block Print Cotton Kurta Set', 'floral-block-print-cotton-kurta-set', '11111111-1111-1111-1111-111111111111', 2699, 4499, 40, 'Bestseller', 'Elegant floral block print kurta set crafted in premium breathable cotton.', '100% Pure Cambric Cotton. Hand wash separately.', 'Free delivery on orders above Rs 2000.', 'Cotton', 'Straight Sets', 'Ivory / Pink', true, true),
('a0000002-0000-0000-0000-000000000002', 'Pastel Organza Silk Saree with Zari Border', 'pastel-organza-silk-saree', '22222222-2222-2222-2222-222222222222', 3499, 5999, 42, 'Trending', 'Breathtaking pastel pink organza silk saree adorned with scalloped hand-cut zari embroidery borders.', 'Pure Organza Silk. Dry clean only.', 'Ships in 1-2 business days.', 'Silk', 'Classic Saree', 'Pastel Pink', true, true),
('a0000003-0000-0000-0000-000000000003', 'Heritage Embroidered Silk Lehenga Set', 'heritage-embroidered-silk-lehenga-set', '33333333-3333-3333-3333-333333333333', 4999, 8999, 44, 'New arrival', 'An exquisite festive lehenga crafted in art silk, featuring intricate sequins and thread embroidery.', 'Art Silk. Dry clean only.', 'Express dispatched in 48 hours.', 'Silk', 'Bridal & Festive', 'Crimson Wine', true, true),
('a0000004-0000-0000-0000-000000000004', 'Georgette Flared Anarkali Suit with Dupatta', 'georgette-flared-anarkali-suit', '44444444-4444-4444-4444-444444444444', 2899, 4800, 40, 'Bestseller', 'Stunning floor-touch Anarkali suit with 32-kali flare and gota patti work.', 'Faux Georgette. Hand wash cold.', 'Delivered in 3-5 business days.', 'Georgette', 'Anarkali Sets', 'Teal', true, true),
('a0000005-0000-0000-0000-000000000005', 'Chic Embroidered Palazzo Suit Set', 'chic-embroidered-palazzo-suit-set', '55555555-5555-5555-5555-555555555555', 2199, 3500, 37, 'Sale', 'Easy-breezy palazzo suit featuring a straight cotton-slub kurta paired with wide-leg flounce palazzos.', 'Cotton Slub. Machine wash.', 'Free standard shipping.', 'Cotton', 'Palazzo Sets', 'Mustard', false, true),
('a0000006-0000-0000-0000-000000000006', 'Festive Tiered Embellished Sharara Set', 'festive-tiered-embellished-sharara-set', '66666666-6666-6666-6666-666666666666', 2999, 4999, 40, 'Trending', 'Intricately embroidered short peplum kurta paired with flared multi-tier sharara bottoms.', 'Chanderi Silk. Dry clean.', 'Dispatches in 24 hours.', 'Chanderi', 'Sharara Sets', 'Mint Sage', false, true),
('a0000007-0000-0000-0000-000000000007', 'Modern Asymmetric Indo-Western Fusion Dress', 'modern-indo-western-fusion-dress', '77777777-7777-7777-7777-777777777777', 2499, 3999, 38, 'New arrival', 'Contemporary fusion piece with high-low asymmetric hemline and cowl bottoms.', 'Crepe Silk. Dry clean.', 'Fast 2-4 day delivery.', 'Silk Blend', 'Fusion Dress', 'Emerald Green', true, true),
('a0000008-0000-0000-0000-000000000008', 'Royal Floor-Length Ethnic Gown', 'royal-floor-length-ethnic-gown', '88888888-8888-8888-8888-888888888888', 3199, 5500, 42, 'Bestseller', 'Floor-sweeping evening gown in art raw silk with hand-worked dabka and pearl embellishments.', 'Art Raw Silk. Dry clean only.', 'Garment bag packaging included.', 'Raw Silk', 'Evening Gowns', 'Midnight Navy', true, true),
('a0000009-0000-0000-0000-000000000009', 'Simple Everyday Cotton Kurti', 'simple-everyday-cotton-kurti', '11111111-1111-1111-1111-111111111111', 999, 1900, 47, 'New arrival', 'Lightweight everyday cotton kurti tailored with side slits and breathable comfort.', '100% Pure Cotton. Regular wash.', 'Standard delivery in 3-5 days.', 'Cotton', 'Daily Wear', 'Butter Yellow', true, true),
('a0000010-0000-0000-0000-000000000010', 'Vibrant Punjabi Salwar Suit Set', 'vibrant-punjabi-salwar-suit-set', '11111111-1111-1111-1111-111111111111', 1699, 2800, 39, 'Bestseller', 'Traditional Punjabi patiala salwar suit with phulkari thread embroidery.', 'Glaze Cotton. Hand wash.', 'Free shipping on prepaid orders.', 'Cotton', 'Patiala Sets', 'Fuschia', true, true),
('a0000011-0000-0000-0000-000000000011', 'Casual Printed Cotton Suit with Dupatta', 'casual-printed-cotton-suit-with-dupatta', '11111111-1111-1111-1111-111111111111', 1499, 2200, 32, 'Sale', 'Breezy Jaipur hand-block printed kurti with straight pants and kotadori dupatta.', 'Jaipur Cotton. Hand wash.', 'Dispatched within 24 hours.', 'Cotton', 'Daily Wear', 'Indigo Blue', true, true),
('a0000012-0000-0000-0000-000000000012', 'Artisanal Banarasi Woven Silk Dupatta', 'artisanal-banarasi-woven-silk-dupatta', '99999999-9999-9999-9999-999999999999', 999, 1800, 44, 'Sale', 'Handcrafted Banarasi zari woven dupatta featuring floral jaal patterns.', 'Chanderi Silk. Dry clean only.', 'Dispatched in 2 business days.', 'Silk', 'Dupattas', 'Gold / Crimson', false, true);

-- 4. Seed Product Images
INSERT INTO product_images (product_id, image_url, display_order) VALUES
('a0000001-0000-0000-0000-000000000001', '/images/ethnic_kurta_set_1789624822973.jpg', 1),
('a0000001-0000-0000-0000-000000000001', '/images/generated_kurta_1.svg', 2),
('a0000002-0000-0000-0000-000000000002', '/images/ethnic_saree_1789624840596.jpg', 1),
('a0000002-0000-0000-0000-000000000002', '/images/generated_saree_1.svg', 2),
('a0000003-0000-0000-0000-000000000003', '/images/ethnic_lehenga_1789624855314.jpg', 1),
('a0000003-0000-0000-0000-000000000003', '/images/generated_lehenga_1.svg', 2),
('a0000004-0000-0000-0000-000000000004', '/images/ethnic_anarkali_1789624868513.jpg', 1),
('a0000005-0000-0000-0000-000000000005', '/images/ethnic_palazzo_suit_1789624892265.jpg', 1),
('a0000006-0000-0000-0000-000000000006', '/images/ethnic_sharara_1789624905126.jpg', 1),
('a0000007-0000-0000-0000-000000000007', '/images/ethnic_fusion_wear_1789624920412.jpg', 1),
('a0000008-0000-0000-0000-000000000008', '/images/ethnic_gown_1789624931377.jpg', 1),
('a0000009-0000-0000-0000-000000000009', '/images/silk_kurta_1789621596703.jpg', 1),
('a0000010-0000-0000-0000-000000000010', '/images/coord_set_1789621584844.jpg', 1),
('a0000011-0000-0000-0000-000000000011', '/images/floral_nightwear_1789621619671.jpg', 1),
('a0000012-0000-0000-0000-000000000012', '/images/generated_saree_4.svg', 1);

-- 5. Seed Product Variants (Size matrix with stock levels)
INSERT INTO product_variants (product_id, size, stock_quantity, sku) VALUES
('a0000001-0000-0000-0000-000000000001', 'S', 8, 'KURTA-FLORAL-S'),
('a0000001-0000-0000-0000-000000000001', 'M', 15, 'KURTA-FLORAL-M'),
('a0000001-0000-0000-0000-000000000001', 'L', 3, 'KURTA-FLORAL-L'), -- low stock
('a0000001-0000-0000-0000-000000000001', 'XL', 12, 'KURTA-FLORAL-XL'),
('a0000002-0000-0000-0000-000000000002', 'Free Size', 22, 'SAREE-ORGANZA-FS'),
('a0000003-0000-0000-0000-000000000003', 'M', 6, 'LEHENGA-HERITAGE-M'),
('a0000003-0000-0000-0000-000000000003', 'L', 2, 'LEHENGA-HERITAGE-L'), -- low stock
('a0000004-0000-0000-0000-000000000004', 'M', 10, 'ANARKALI-GEORG-M'),
('a0000005-0000-0000-0000-000000000005', 'M', 14, 'PALAZZO-EMB-M'),
('a0000006-0000-0000-0000-000000000006', 'M', 7, 'SHARARA-TIER-M'),
('a0000007-0000-0000-0000-000000000007', 'M', 11, 'INDO-FUSION-M'),
('a0000008-0000-0000-0000-000000000008', 'M', 9, 'GOWN-ROYAL-M'),
('a0000009-0000-0000-0000-000000000009', 'M', 25, 'KURTI-EVRYDAY-M'),
('a0000010-0000-0000-0000-000000000010', 'M', 18, 'PATIALA-PUNJ-M'),
('a0000011-0000-0000-0000-000000000011', 'M', 12, 'SUIT-CASUAL-M'),
('a0000012-0000-0000-0000-000000000012', 'Free Size', 30, 'DUPATTA-BANARASI-FS');

-- 6. Seed Coupons
INSERT INTO coupons (code, discount_type, discount_value, min_order_value, usage_limit, times_used, is_active) VALUES
('AVYARA10', 'percentage', 10.00, 1000.00, 500, 42, true),
('BUY3', 'fixed', 500.00, 2500.00, 200, 18, true),
('FESTIVE20', 'percentage', 20.00, 4000.00, 100, 5, true);

-- 7. Seed Orders
INSERT INTO orders (id, customer_name, customer_email, customer_phone, shipping_address, subtotal, discount, shipping_fee, total, status, payment_method, payment_status, tracking_carrier, tracking_number) VALUES
('AVY-98214', 'Ananya Sharma', 'ananya.sharma@example.com', '+91 98765 43210', '{"fullName": "Ananya Sharma", "street": "Flat 402, Royal Palms, Palm Beach Road", "city": "Mumbai", "state": "Maharashtra", "pincode": "400706"}', 2699.00, 0.00, 0.00, 2699.00, 'Delivered', 'UPI', 'Paid', 'Bluedart Express', '882940182'),
('AVY-98215', 'Rhea Kapoor', 'rhea.k@example.com', '+91 98111 22334', '{"fullName": "Rhea Kapoor", "street": "B-12 Defence Colony", "city": "New Delhi", "state": "Delhi", "pincode": "110024"}', 3499.00, 349.90, 0.00, 3149.10, 'Shipped', 'Card', 'Paid', 'Delhivery Surface', '773910291'),
('AVY-98216', 'Pooja Hegde', 'pooja.h@example.com', '+91 99000 88776', '{"fullName": "Pooja Hegde", "street": "44 Jubilee Hills", "city": "Hyderabad", "state": "Telangana", "pincode": "500033"}', 4999.00, 0.00, 0.00, 4999.00, 'Processing', 'UPI', 'Paid', NULL, NULL),
('AVY-98217', 'Sneha Roy', 'sneha.roy@example.com', '+91 97444 33221', '{"fullName": "Sneha Roy", "street": "Salt Lake Sector V", "city": "Kolkata", "state": "West Bengal", "pincode": "700091"}', 1699.00, 0.00, 150.00, 1849.00, 'Confirmed', 'COD', 'Pending', NULL, NULL);

-- 8. Seed Order Items
INSERT INTO order_items (order_id, product_id, product_title, product_image, size, quantity, unit_price) VALUES
('AVY-98214', 'a0000001-0000-0000-0000-000000000001', 'Floral Block Print Cotton Kurta Set', '/images/ethnic_kurta_set_1789624822973.jpg', 'M', 1, 2699.00),
('AVY-98215', 'a0000002-0000-0000-0000-000000000002', 'Pastel Organza Silk Saree with Zari Border', '/images/ethnic_saree_1789624840596.jpg', 'Free Size', 1, 3499.00),
('AVY-98216', 'a0000003-0000-0000-0000-000000000003', 'Heritage Embroidered Silk Lehenga Set', '/images/ethnic_lehenga_1789624855314.jpg', 'M', 1, 4999.00),
('AVY-98217', 'a0000010-0000-0000-0000-000000000010', 'Vibrant Punjabi Salwar Suit Set', '/images/coord_set_1789621584844.jpg', 'M', 1, 1699.00);

-- 9. Seed Return Requests
INSERT INTO return_requests (id, order_id, customer_email, request_type, reason, comments, status) VALUES
('RET-88491', 'AVY-98214', 'ananya.sharma@example.com', 'Exchange', 'Size too large', 'Please exchange for Size S', 'Pending');
