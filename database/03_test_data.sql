-- =============================================================
-- 03_test_data.sql
-- Hotel Management Database - Test Data
-- Must be run AFTER 01_schema.sql and 02_constraints.sql
-- Covers all minimum requirements for L5 (5 pts)
-- =============================================================
USE hotel_db;
-- =============================================================
-- 1. CLIENTS (minimum 10)
-- BR-09: unique phone and email
-- Client 10 (Leroy Emma) has NO reservation → edge case required
-- =============================================================
INSERT INTO clients (client_id, last_name, first_name, phone_number, email) VALUES
(1,  'Smith',    'John',    '+1-555-0101', 'john.smith@email.com'),
(2,  'Dupont',   'Marie',   '+33-600-0102','marie.dupont@email.com'),
(3,  'Johnson',  'Bob',     '+1-555-0103', 'bob.johnson@email.com'),
(4,  'Martin',   'Claire',  '+33-600-0104','claire.martin@email.com'),
(5,  'Williams', 'Tom',     '+1-555-0105', 'tom.williams@email.com'),
(6,  'Bernard',  'Alice',   '+33-600-0106','alice.bernard@email.com'),
(7,  'Taylor',   'James',   '+1-555-0107', 'james.taylor@email.com'),
(8,  'Moreau',   'Sophie',  '+33-600-0108','sophie.moreau@email.com'),
(9,  'Anderson', 'Peter',   '+1-555-0109', 'peter.anderson@email.com'),
(10, 'Leroy',    'Emma',    '+33-600-0110','emma.leroy@email.com');  -- no reservation (edge case)
-- =============================================================
-- 2. ROOMS (minimum 15)
-- BR-01: unique number, floor, type, capacity, base price
-- BR-03: operational_status
-- At least 3 types (single/double/suite), 1 room out of service
-- =============================================================
INSERT INTO rooms (room_number, floor, room_type, max_capacity, base_price, operational_status) VALUES
-- Single rooms (floor 1)
(101, 1, 'single', 1, 80.00,  'available'),
(102, 1, 'single', 1, 80.00,  'available'),
(103, 1, 'single', 2, 90.00,  'available'),
(104, 1, 'single', 2, 90.00,  'available'),
(105, 1, 'single', 1, 75.00,  'out of service'),  -- edge case: out of service
-- Double rooms (floor 2)
(201, 2, 'double', 2, 120.00, 'available'),
(202, 2, 'double', 2, 120.00, 'available'),
(203, 2, 'double', 3, 140.00, 'available'),
(204, 2, 'double', 3, 140.00, 'available'),
(205, 2, 'double', 2, 130.00, 'available'),
-- Suite rooms (floor 3)
(301, 3, 'suite',  4, 250.00, 'available'),
(302, 3, 'suite',  4, 250.00, 'available'),
(303, 3, 'suite',  6, 320.00, 'available'),
(304, 3, 'suite',  4, 280.00, 'available'),
(305, 3, 'suite',  2, 200.00, 'available');
-- =============================================================
-- 3. AMENITIES (BR-02)
-- =============================================================
INSERT INTO amenities (amenity_id, amenity_name, description) VALUES
(1, 'Sea View',    'Direct view of the ocean from the room'),
(2, 'Balcony',     'Private outdoor balcony'),
(3, 'Bathtub',     'Luxury bathtub in the bathroom'),
(4, 'WiFi',        'High-speed wireless internet access'),
(5, 'Air Conditioning', 'Climate control system');
-- =============================================================
-- 4. ROOM AMENITIES (BR-02: N-M relationship)
-- =============================================================
INSERT INTO room_amenities (room_number, amenity_id) VALUES
(101, 4), (101, 5),              -- single: WiFi + AC
(102, 4), (102, 5),
(103, 2), (103, 4), (103, 5),    -- single: Balcony + WiFi + AC
(201, 1), (201, 4), (201, 5),    -- double: Sea View + WiFi + AC
(202, 4), (202, 5),
(203, 1), (203, 2), (203, 4),    -- double: Sea View + Balcony + WiFi
(301, 1), (301, 2), (301, 3), (301, 4), (301, 5),  -- suite: all amenities
(302, 1), (302, 3), (302, 4), (302, 5),
(303, 1), (303, 2), (303, 3), (303, 4), (303, 5);
-- =============================================================
-- 5. SERVICES (minimum 4) — BR-11
-- Hours and capacity managed in service_schedule
-- =============================================================
INSERT INTO services (service_id, service_name, description, price) VALUES
(1, 'Spa',        'Relaxation and wellness treatments', 60.00),
(2, 'Restaurant', 'Fine dining restaurant on-site',    35.00),
(3, 'Gym',        'Fully equipped fitness center',     20.00),
(4, 'Pool',       'Heated indoor/outdoor swimming pool', 15.00);
-- =============================================================
-- 5b. SERVICE SCHEDULE (BR-11: hours vary by day of week)
-- =============================================================
-- Spa: Mon-Sat 09:00-20:00, closed Sunday
INSERT INTO service_schedule (service_id, day_of_week, opening_time, closing_time, capacity_per_slot) VALUES
(1, 'Monday',    '09:00', '20:00', 10),
(1, 'Tuesday',   '09:00', '20:00', 10),
(1, 'Wednesday', '09:00', '20:00', 10),
(1, 'Thursday',  '09:00', '20:00', 10),
(1, 'Friday',    '09:00', '21:00', 15),
(1, 'Saturday',  '08:00', '21:00', 15);
-- (Spa closed on Sunday — no row for Sunday)
-- Restaurant: Mon-Fri 07:00-22:00, Sat-Sun 08:00-23:00
INSERT INTO service_schedule (service_id, day_of_week, opening_time, closing_time, capacity_per_slot) VALUES
(2, 'Monday',    '07:00', '22:00', 50),
(2, 'Tuesday',   '07:00', '22:00', 50),
(2, 'Wednesday', '07:00', '22:00', 50),
(2, 'Thursday',  '07:00', '22:00', 50),
(2, 'Friday',    '07:00', '22:00', 50),
(2, 'Saturday',  '08:00', '23:00', 60),
(2, 'Sunday',    '08:00', '23:00', 60);
-- Gym: Mon-Sat 06:00-21:00, closed Sunday
INSERT INTO service_schedule (service_id, day_of_week, opening_time, closing_time, capacity_per_slot) VALUES
(3, 'Monday',    '06:00', '21:00', 30),
(3, 'Tuesday',   '06:00', '21:00', 30),
(3, 'Wednesday', '06:00', '21:00', 30),
(3, 'Thursday',  '06:00', '21:00', 30),
(3, 'Friday',    '06:00', '21:00', 30),
(3, 'Saturday',  '07:00', '20:00', 25);
-- Pool: Mon-Sun 08:00-19:00
INSERT INTO service_schedule (service_id, day_of_week, opening_time, closing_time, capacity_per_slot) VALUES
(4, 'Monday',    '08:00', '19:00', 40),
(4, 'Tuesday',   '08:00', '19:00', 40),
(4, 'Wednesday', '08:00', '19:00', 40),
(4, 'Thursday',  '08:00', '19:00', 40),
(4, 'Friday',    '08:00', '19:00', 40),
(4, 'Saturday',  '08:00', '19:00', 50),
(4, 'Sunday',    '09:00', '18:00', 35);
-- =============================================================
-- 6. RESERVATIONS (minimum 20)
-- BR-06: statuses: pending, confirmed, cancelled, completed
-- BR-04: each belongs to one client
-- =============================================================
INSERT INTO reservations
    (reservation_id, client_id, check_in_date, check_out_date, num_guests, status, creation_date, cancellation_date)
VALUES
-- COMPLETED reservations (past stays → eligible for invoices + reviews)
(1,  1, '2026-01-10', '2026-01-15', 1, 'completed', '2025-12-20 10:00:00', NULL),
(2,  2, '2026-01-20', '2026-01-25', 4, 'completed', '2025-12-22 14:00:00', NULL),  -- multi-room
(3,  3, '2026-02-01', '2026-02-08', 3, 'completed', '2026-01-05 09:00:00', NULL),
(4,  4, '2026-02-15', '2026-02-17', 1, 'completed', '2026-01-10 11:00:00', NULL),
(5,  5, '2026-03-01', '2026-03-05', 2, 'completed', '2026-02-01 10:00:00', NULL),
(6,  6, '2026-03-10', '2026-03-15', 4, 'completed', '2026-02-15 08:00:00', NULL),
(7,  7, '2026-04-01', '2026-04-04', 1, 'completed', '2026-03-01 12:00:00', NULL),
(8,  8, '2026-04-20', '2026-04-25', 2, 'completed', '2026-03-20 09:00:00', NULL),
(9,  1, '2026-05-01', '2026-05-03', 2, 'completed', '2026-04-10 10:00:00', NULL),  -- client 1 returns
(10, 2, '2026-05-10', '2026-05-15', 4, 'completed', '2026-04-15 11:00:00', NULL),
-- CANCELLED reservations (rooms are freed)
(11, 3, '2026-06-01', '2026-06-05', 1, 'cancelled', '2026-05-01 10:00:00', '2026-05-20 14:00:00'),
(12, 4, '2026-06-10', '2026-06-12', 2, 'cancelled', '2026-05-10 09:00:00', '2026-05-25 16:00:00'),
-- CONFIRMED reservations (future bookings)
(13, 5, '2026-11-01', '2026-11-05', 3, 'confirmed', '2026-09-01 10:00:00', NULL),
(14, 6, '2026-11-10', '2026-11-15', 1, 'confirmed', '2026-09-10 14:00:00', NULL),
(15, 7, '2026-11-20', '2026-11-25', 2, 'confirmed', '2026-09-15 09:00:00', NULL),
(16, 8, '2026-12-01', '2026-12-05', 4, 'confirmed', '2026-10-01 10:00:00', NULL),
-- PENDING reservations
(17, 9, '2026-12-10', '2026-12-14', 2, 'pending',   '2026-10-15 08:00:00', NULL),
(18, 1, '2026-12-20', '2026-12-25', 1, 'pending',   '2026-10-15 09:00:00', NULL),
(19, 2, '2026-12-28', '2027-01-02', 3, 'pending',   '2026-10-16 11:00:00', NULL),
(20, 3, '2027-01-10', '2027-01-15', 4, 'pending',   '2026-10-17 10:00:00', NULL);  -- multi-room future
-- =============================================================
-- 7. RESERVED ROOMS (BR-04, BR-07, BR-08)
-- nightly_price fixed at booking time (BR-08)
-- No overlapping non-cancelled bookings on same room (BR-07)
-- =============================================================
INSERT INTO reserved_rooms (reservation_id, room_number, nightly_price) VALUES
-- Res 1 → room 101 (single)
(1,  101, 80.00),
-- Res 2 → rooms 201 + 202 (multi-room reservation — BR-04)
(2,  201, 120.00),
(2,  202, 120.00),
-- Res 3 → room 301 (suite)
(3,  301, 250.00),
-- Res 4 → room 102 (single)
(4,  102, 80.00),
-- Res 5 → room 203 (double)
(5,  203, 140.00),
-- Res 6 → room 302 (suite)
(6,  302, 250.00),
-- Res 7 → room 103 (single)
(7,  103, 90.00),
-- Res 8 → room 204 (double)
(8,  204, 140.00),
-- Res 9 → room 104 (single, client 1 returns)
(9,  104, 90.00),
-- Res 10 → room 303 (suite)
(10, 303, 320.00),
-- Res 11 (cancelled) → room 102 — freed (BR-07: cancelled frees rooms)
(11, 102, 80.00),
-- Res 12 (cancelled) → room 201
(12, 201, 120.00),
-- Future confirmed reservations
(13, 301, 260.00),   -- price updated at booking time
(14, 101, 85.00),
(15, 202, 125.00),
(16, 304, 280.00),
-- Future pending
(17, 205, 130.00),
(18, 104, 92.00),
(19, 103, 92.00),
-- Res 20 → multi-room future (rooms 203 + 305)
(20, 203, 145.00),
(20, 305, 205.00);
-- =============================================================
-- 8. SERVICE BOOKINGS (BR-12)
-- booking_date must be within the reservation's stay
-- booking_time must be within the service's opening hours
-- =============================================================
INSERT INTO service_bookings (reservation_id, service_id, booking_date, booking_time, quantity) VALUES
-- Res 1 (Jan 10-15, Mon): spa on Jan 12 (Wednesday) at 10:00
(1, 1, '2026-01-12', '10:00', 1),
-- Res 1: restaurant on Jan 13 (Thursday) at 19:00
(1, 2, '2026-01-13', '19:00', 1),
-- Res 2 (Jan 20-25): pool on Jan 21 (Wednesday) at 09:00, qty 2
(2, 4, '2026-01-21', '09:00', 2),
-- Res 3 (Feb 1-8): gym on Feb 2 (Monday) at 07:00
(3, 3, '2026-02-02', '07:00', 1),
-- Res 3: spa on Feb 5 (Thursday) at 14:00
(3, 1, '2026-02-05', '14:00', 2),
-- Res 5 (Mar 1-5): restaurant on Mar 3 (Tuesday) at 12:00, qty 2
(5, 2, '2026-03-03', '12:00', 2),
-- Res 6 (Mar 10-15): spa on Mar 11 (Wednesday) at 11:00, qty 4
(6, 1, '2026-03-11', '11:00', 4),
-- Res 8 (Apr 20-25): pool on Apr 22 (Wednesday) at 10:00, qty 2
(8, 4, '2026-04-22', '10:00', 2);
-- =============================================================
-- 9. INVOICES (minimum 10)
-- BR-13: one invoice per reservation (UNIQUE on reservation_id)
-- BR-15: total_amount in DECIMAL; status: due/partially paid/paid
-- Cases required: 1 paid, 1 partially paid, 1 due
-- =============================================================
INSERT INTO invoices (invoice_id, reservation_id, total_amount, tax_rate, status) VALUES
-- Paid invoices (completed reservations fully paid)
(1,  1,  484.00,  10.00, 'paid'),          -- 5 nights * 80 * 1.10 + spa + restaurant
(3,  3,  1942.00, 10.00, 'paid'),          -- 7 nights * 250 * 1.10 + services
(5,  5,  679.70,  10.00, 'paid'),          -- 4 nights * 140 * 1.10 + restaurant
(7,  7,  297.00,  10.00, 'paid'),          -- 3 nights * 90 * 1.10
-- Partially paid
(2,  2,  1386.00, 10.00, 'partially paid'), -- 5 nights * (120+120) * 1.10 + pool
(6,  6,  1430.00, 10.00, 'partially paid'), -- 5 nights * 250 * 1.10 + spa
-- Due (unpaid)
(4,  4,  176.00,  10.00, 'due'),           -- 2 nights * 80 * 1.10
(8,  8,  792.00,  10.00, 'due'),           -- 5 nights * 140 * 1.10 + pool
(9,  9,  207.90,  10.00, 'due'),           -- 2 nights * 90 * 1.10
(10, 10, 1804.00, 10.00, 'due');           -- 5 nights * 320 * 1.10
-- =============================================================
-- 10. INVOICE LINES (BR-13: nights + services + miscellaneous)
-- =============================================================
INSERT INTO invoice_lines (invoice_id, line_type, description, quantity, unit_price) VALUES
-- Invoice 1 (Res 1: 5 nights room 101 + spa + restaurant)
(1, 'night',   'Room 101 (single) - 5 nights',    5, 80.00),
(1, 'service', 'Spa session',                      1, 60.00),
(1, 'service', 'Restaurant dinner',                1, 35.00),
-- Invoice 2 (Res 2: 5 nights rooms 201+202 + pool)
(2, 'night',   'Room 201 (double) - 5 nights',    5, 120.00),
(2, 'night',   'Room 202 (double) - 5 nights',    5, 120.00),
(2, 'service', 'Pool access x2',                  2, 15.00),
-- Invoice 3 (Res 3: 7 nights room 301 + gym + spa)
(3, 'night',   'Room 301 (suite) - 7 nights',     7, 250.00),
(3, 'service', 'Gym session',                      1, 20.00),
(3, 'service', 'Spa session x2',                  2, 60.00),
-- Invoice 4 (Res 4: 2 nights room 102)
(4, 'night',   'Room 102 (single) - 2 nights',    2, 80.00),
-- Invoice 5 (Res 5: 4 nights room 203 + restaurant x2)
(5, 'night',   'Room 203 (double) - 4 nights',    4, 140.00),
(5, 'service', 'Restaurant lunch x2',              2, 35.00),
-- Invoice 6 (Res 6: 5 nights room 302 + spa x4)
(6, 'night',   'Room 302 (suite) - 5 nights',     5, 250.00),
(6, 'service', 'Spa session x4',                  4, 60.00),
-- Invoice 7 (Res 7: 3 nights room 103)
(7, 'night',   'Room 103 (single) - 3 nights',    3, 90.00),
-- Invoice 8 (Res 8: 5 nights room 204 + pool x2)
(8, 'night',   'Room 204 (double) - 5 nights',    5, 140.00),
(8, 'service', 'Pool access x2',                  2, 15.00),
-- Invoice 9 (Res 9: 2 nights room 104)
(9, 'night',   'Room 104 (single) - 2 nights',    2, 90.00),
-- Invoice 10 (Res 10: 5 nights room 303)
(10, 'night',  'Room 303 (suite) - 5 nights',     5, 320.00);
-- =============================================================
-- 11. PAYMENTS (BR-14, BR-15)
-- Paid invoices have full payments; partially paid have partial
-- =============================================================
INSERT INTO payments (invoice_id, payment_date, amount, payment_method) VALUES
-- Invoice 1: fully paid (484.00) in one payment
(1, '2026-01-16 10:00:00', 484.00, 'card'),
-- Invoice 3: fully paid in two payments
(3, '2026-02-09 09:00:00', 1000.00, 'bank transfer'),
(3, '2026-02-09 09:30:00', 942.00,  'bank transfer'),
-- Invoice 5: fully paid
(5, '2026-03-06 11:00:00', 679.70,  'cash'),
-- Invoice 7: fully paid
(7, '2026-04-05 10:00:00', 297.00,  'card'),
-- Invoice 2: partially paid (1386.00 due, 700.00 paid)
(2, '2026-01-26 14:00:00', 700.00,  'mobile money'),
-- Invoice 6: partially paid (1430.00 due, 500.00 paid)
(6, '2026-03-16 09:00:00', 500.00,  'cash');
-- Invoices 4, 8, 9, 10 remain unpaid (status = 'due')
-- =============================================================
-- 12. CLIENT REVIEWS (minimum 6)
-- BR-16: only completed reservations (UNIQUE per reservation)
-- BR-17: rating 1-5, review_date >= check_out_date
-- =============================================================
INSERT INTO client_reviews (reservation_id, rating, comment, review_date) VALUES
(1, 5, 'Excellent stay! Very clean room and great service.', '2026-01-16'),
(2, 4, 'Beautiful rooms, the pool was amazing.', '2026-01-26'),
(3, 3, 'Good stay overall, spa was worth it.', '2026-02-09'),
(4, 2, 'Room was okay but service was slow.', '2026-02-18'),
(5, 1, 'Disappointing experience, room was noisy.', '2026-03-06'),
(7, 5, 'Perfect weekend, will definitely return!', '2026-04-05');