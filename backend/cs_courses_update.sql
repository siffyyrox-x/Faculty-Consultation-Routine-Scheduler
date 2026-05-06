-- =============================================
-- Computer Science Courses & Faculty Update
-- Version: 1.0.1
-- Updated: 2026-05-07
-- =============================================

-- Add desk_no field to faculty table
ALTER TABLE faculty ADD COLUMN desk_no VARCHAR(50) AFTER phone;

-- Update existing faculty with desk numbers
UPDATE faculty SET desk_no = 'CS-301-A' WHERE id = 1;
UPDATE faculty SET desk_no = 'CS-205-B' WHERE id = 2;
UPDATE faculty SET desk_no = 'MATH-102' WHERE id = 3;
UPDATE faculty SET desk_no = 'PHY-LAB-3' WHERE id = 4;

-- =============================================
-- Add 10 Computer Science Courses
-- =============================================
INSERT INTO courses (course_code, course_name, department) VALUES
('CSE102', 'Object-Oriented Programming', 'Computer Science'),
('CSE202', 'Operating Systems', 'Computer Science'),
('CSE203', 'Computer Networks', 'Computer Science'),
('CSE204', 'Software Engineering', 'Computer Science'),
('CSE305', 'Machine Learning', 'Computer Science'),
('CSE306', 'Artificial Intelligence', 'Computer Science'),
('CSE307', 'Web Development', 'Computer Science'),
('CSE308', 'Mobile App Development', 'Computer Science'),
('CSE401', 'Cybersecurity', 'Computer Science'),
('CSE402', 'Cloud Computing', 'Computer Science');

-- =============================================
-- Add 7 More Computer Science Faculty
-- =============================================
-- Password for all: password123
INSERT INTO faculty (name, email, password, department, phone, desk_no, is_registered) VALUES
('Dr. David Kumar', 'david.k@university.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Computer Science', '123-456-7894', 'CS-303-A', TRUE),
('Prof. Lisa Anderson', 'lisa.a@university.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Computer Science', '123-456-7895', 'CS-304-B', TRUE),
('Dr. Robert Martinez', 'robert.m@university.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Computer Science', '123-456-7896', 'CS-401-C', TRUE),
('Prof. Jennifer Lee', 'jennifer.l@university.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Computer Science', '123-456-7897', 'CS-402-A', TRUE),
('Dr. William Brown', 'william.b@university.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Computer Science', '123-456-7898', 'CS-403-B', TRUE),
('Prof. Michelle Taylor', 'michelle.t@university.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Computer Science', '123-456-7899', 'CS-404-C', TRUE),
('Dr. Kevin Zhang', 'kevin.z@university.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Computer Science', '123-456-7900', 'CS-405-A', TRUE);

-- =============================================
-- Add Consultations (At least 3 faculty per course)
-- =============================================

-- CSE102 - Object-Oriented Programming (Faculty: Sarah, Michael, David, Lisa)
INSERT INTO consultations (faculty_id, course_id, day_of_week, start_time, end_time, location) VALUES
(1, 8, 'Thursday', '10:00:00', '11:30:00', 'Room 301, CS Building'),
(2, 8, 'Monday', '14:00:00', '15:30:00', 'Room 205, CS Building'),
(5, 8, 'Wednesday', '09:00:00', '11:00:00', 'Room 303, CS Building'),
(6, 8, 'Friday', '13:00:00', '14:30:00', 'Room 304, CS Building');

-- CSE202 - Operating Systems (Faculty: Michael, David, Robert, William)
INSERT INTO consultations (faculty_id, course_id, day_of_week, start_time, end_time, location) VALUES
(2, 9, 'Tuesday', '10:00:00', '12:00:00', 'Room 205, CS Building'),
(5, 9, 'Thursday', '14:00:00', '16:00:00', 'Room 303, CS Building'),
(7, 9, 'Monday', '11:00:00', '12:30:00', 'Room 401, CS Building'),
(9, 9, 'Wednesday', '15:00:00', '17:00:00', 'Room 403, CS Building');

-- CSE203 - Computer Networks (Faculty: Sarah, David, Lisa, Jennifer)
INSERT INTO consultations (faculty_id, course_id, day_of_week, start_time, end_time, location) VALUES
(1, 10, 'Friday', '09:00:00', '11:00:00', 'Room 301, CS Building'),
(5, 10, 'Monday', '13:00:00', '15:00:00', 'Room 303, CS Building'),
(6, 10, 'Tuesday', '10:00:00', '12:00:00', 'Room 304, CS Building'),
(8, 10, 'Thursday', '14:00:00', '16:00:00', 'Room 402, CS Building');

-- CSE204 - Software Engineering (Faculty: Michael, Robert, Jennifer, Michelle)
INSERT INTO consultations (faculty_id, course_id, day_of_week, start_time, end_time, location) VALUES
(2, 11, 'Friday', '10:00:00', '12:00:00', 'Room 205, CS Building'),
(7, 11, 'Wednesday', '09:00:00', '11:00:00', 'Room 401, CS Building'),
(8, 11, 'Monday', '15:00:00', '17:00:00', 'Room 402, CS Building'),
(10, 11, 'Thursday', '10:00:00', '12:00:00', 'Room 404, CS Building');

-- CSE305 - Machine Learning (Faculty: David, Robert, William, Kevin)
INSERT INTO consultations (faculty_id, course_id, day_of_week, start_time, end_time, location) VALUES
(5, 12, 'Tuesday', '11:00:00', '13:00:00', 'Room 303, CS Building'),
(7, 12, 'Friday', '14:00:00', '16:00:00', 'Room 401, CS Building'),
(9, 12, 'Monday', '09:00:00', '11:00:00', 'Room 403, CS Building'),
(11, 12, 'Wednesday', '13:00:00', '15:00:00', 'Room 405, CS Building');

-- CSE306 - Artificial Intelligence (Faculty: Lisa, Robert, Jennifer, Kevin)
INSERT INTO consultations (faculty_id, course_id, day_of_week, start_time, end_time, location) VALUES
(6, 13, 'Monday', '10:00:00', '12:00:00', 'Room 304, CS Building'),
(7, 13, 'Tuesday', '14:00:00', '16:00:00', 'Room 401, CS Building'),
(8, 13, 'Friday', '09:00:00', '11:00:00', 'Room 402, CS Building'),
(11, 13, 'Thursday', '11:00:00', '13:00:00', 'Room 405, CS Building');

-- CSE307 - Web Development (Faculty: Sarah, Lisa, Michelle, Kevin)
INSERT INTO consultations (faculty_id, course_id, day_of_week, start_time, end_time, location) VALUES
(1, 14, 'Tuesday', '13:00:00', '15:00:00', 'Room 301, CS Building'),
(6, 14, 'Wednesday', '14:00:00', '16:00:00', 'Room 304, CS Building'),
(10, 14, 'Monday', '11:00:00', '13:00:00', 'Room 404, CS Building'),
(11, 14, 'Friday', '10:00:00', '12:00:00', 'Room 405, CS Building');

-- CSE308 - Mobile App Development (Faculty: Michael, David, William, Michelle)
INSERT INTO consultations (faculty_id, course_id, day_of_week, start_time, end_time, location) VALUES
(2, 15, 'Wednesday', '13:00:00', '15:00:00', 'Room 205, CS Building'),
(5, 15, 'Friday', '11:00:00', '13:00:00', 'Room 303, CS Building'),
(9, 15, 'Tuesday', '09:00:00', '11:00:00', 'Room 403, CS Building'),
(10, 15, 'Thursday', '13:00:00', '15:00:00', 'Room 404, CS Building');

-- CSE401 - Cybersecurity (Faculty: Sarah, Robert, William, Kevin)
INSERT INTO consultations (faculty_id, course_id, day_of_week, start_time, end_time, location) VALUES
(1, 16, 'Monday', '11:00:00', '13:00:00', 'Room 301, CS Building'),
(7, 16, 'Thursday', '10:00:00', '12:00:00', 'Room 401, CS Building'),
(9, 16, 'Friday', '14:00:00', '16:00:00', 'Room 403, CS Building'),
(11, 16, 'Tuesday', '10:00:00', '12:00:00', 'Room 405, CS Building');

-- CSE402 - Cloud Computing (Faculty: Michael, Jennifer, Michelle, Kevin)
INSERT INTO consultations (faculty_id, course_id, day_of_week, start_time, end_time, location) VALUES
(2, 17, 'Monday', '09:00:00', '11:00:00', 'Room 205, CS Building'),
(8, 17, 'Wednesday', '10:00:00', '12:00:00', 'Room 402, CS Building'),
(10, 17, 'Friday', '15:00:00', '17:00:00', 'Room 404, CS Building'),
(11, 17, 'Monday', '14:00:00', '16:00:00', 'Room 405, CS Building');

-- =============================================
-- Verification Query
-- =============================================
-- Check courses with faculty count
-- SELECT 
--     co.course_name,
--     COUNT(DISTINCT c.faculty_id) as faculty_count
-- FROM courses co
-- JOIN consultations c ON co.id = c.course_id
-- WHERE co.department = 'Computer Science'
-- GROUP BY co.id, co.course_name
-- ORDER BY co.course_name;
