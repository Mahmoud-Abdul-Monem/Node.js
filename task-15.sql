
-- CREATE TABLE members (
--     member_id SERIAL PRIMARY KEY,
--     full_name VARCHAR(50) NOT NULL,
--     email VARCHAR(100) UNIQUE,
--     phone VARCHAR(20),
--     join_date DATE DEFAULT CURRENT_DATE
-- );

-- CREATE TABLE plans (
--     plan_id SERIAL PRIMARY KEY,
--     plan_name VARCHAR(50) NOT NULL,
--     price DECIMAL(10, 2) NOT NULL,
--     duration_months INT NOT NULL
-- );

-- CREATE TABLE memberships (
--     membership_id SERIAL PRIMARY KEY,
--     member_id INT REFERENCES members(member_id) ON DELETE CASCADE,
--     plan_id INT REFERENCES plans(plan_id),
--     start_date DATE NOT NULL,
--     end_date DATE NOT NULL,
--     status VARCHAR(20) DEFAULT 'Active'
-- );

-- CREATE TABLE trainers (
--     trainer_id SERIAL PRIMARY KEY,
--     full_name VARCHAR(50) NOT NULL,
--     specialization VARCHAR(50)
-- );

-- INSERT INTO plans (plan_name, price, duration_months) VALUES
-- ('Monthly Basic', 300.00, 1),
-- ('Quarterly VIP', 800.00, 3),
-- ('Annual Elite', 2500.00, 12);

-- INSERT INTO trainers (full_name, specialization) VALUES
-- ('Ahmed', 'Fitness'),
-- ('Mohamed', 'Bodybuilding');

-- INSERT INTO members (full_name, email, phone) VALUES
-- ('Omar', 'omar@xample.com', '01012345678'),
-- ('Youssef', 'youssefexample.com', '01123456789'),
-- ('Sara', 'saraexample.com', '01234567890');

-- INSERT INTO memberships (member_id, plan_id, start_date, end_date, status) VALUES
-- (1, 1, '2026-09-01', '2026-10-01', 'Active'),
-- (2, 2, '2026-08-01', '2026-11-01', 'Active'),
-- (3, 3, '2025-09-01', '2026-09-01', 'Expired');
-- SELECT * FROM members;

-- SELECT * FROM plans 
-- WHERE price BETWEEN 300.00 AND 1000.00;

-- SELECT * FROM members 
-- WHERE email LIKE '%@example.com';

-- SELECT * FROM members 
-- ORDER BY member_id 
-- LIMIT 2 OFFSET 1;

SELECT * FROM memberships 
WHERE status = 'Active' 
ORDER BY start_date DESC;