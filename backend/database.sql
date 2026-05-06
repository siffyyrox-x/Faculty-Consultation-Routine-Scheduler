-- =============================================
-- Faculty Consultation Scheduler - Database Schema
-- Version: 1.1.0
-- Updated: 2026-05-07
-- =============================================

-- Drop existing tables if they exist
DROP TABLE IF EXISTS routine_items;
DROP TABLE IF EXISTS consultation_requests;
DROP TABLE IF EXISTS consultations;
DROP TABLE IF EXISTS faculty;
DROP TABLE IF EXISTS courses;

-- =============================================
-- 1. FACULTY TABLE
-- Stores profile information for faculty members
-- =============================================
CREATE TABLE faculty (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- hashed password
    department VARCHAR(255) NOT NULL,
    initial VARCHAR(10),
    desk_no VARCHAR(50),
    is_registered BOOLEAN DEFAULT TRUE, -- Only registered faculty appear in searches
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_registered (is_registered)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 2. COURSES TABLE
-- =============================================
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(50) UNIQUE NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_course_name (course_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 3. CONSULTATIONS TABLE (Faculty Consultation Hours)
-- =============================================
CREATE TABLE consultations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    faculty_id INT NOT NULL,
    course_id INT NOT NULL,
    day_of_week ENUM('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location VARCHAR(255) NOT NULL, -- Can be updated daily
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_faculty (faculty_id),
    INDEX idx_course (course_id),
    INDEX idx_day (day_of_week)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 4. CONSULTATION REQUESTS TABLE (Student Requests)
-- =============================================
CREATE TABLE consultation_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    faculty_id INT NOT NULL,
    consultation_id INT NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    student_email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('pending', 'approved', 'denied') DEFAULT 'pending',
    response_message TEXT, -- Message from faculty when approving/denying
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE CASCADE,
    FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE CASCADE,
    INDEX idx_faculty (faculty_id),
    INDEX idx_status (status),
    INDEX idx_student (student_email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 5. ROUTINE ITEMS TABLE (Student's Saved Routine)
-- =============================================
CREATE TABLE routine_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_email VARCHAR(255) NOT NULL,
    consultation_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE CASCADE,
    INDEX idx_student (student_email),
    UNIQUE KEY unique_student_consultation (student_email, consultation_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- SAMPLE DATA FOR TESTING
-- =============================================

-- Insert sample courses
INSERT INTO courses (course_code, course_name, department) VALUES
('CSE101', 'Data Structures', 'Computer Science'),
('CSE201', 'Algorithms', 'Computer Science'),
('CSE301', 'Database Systems', 'Computer Science'),
('MATH101', 'Calculus I', 'Mathematics'),
('MATH201', 'Linear Algebra', 'Mathematics'),
('PHY101', 'Physics I', 'Physics'),
('PHY201', 'Quantum Mechanics', 'Physics');

-- Insert sample faculty (password is 'password123' hashed with bcrypt)
-- Note: Use password_hash('password123', PASSWORD_BCRYPT) in PHP
INSERT INTO faculty (name, email, password, department, initial, desk_no, is_registered) VALUES
('Dr. Sarah Johnson', 'sarah.j@university.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Computer Science', 'SRH', 'CS-301-A', TRUE),
('Prof. Michael Chen', 'michael.c@university.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Computer Science', 'MCH', 'CS-205-B', TRUE),
('Dr. Emily Rodriguez', 'emily.r@university.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mathematics', 'EMR', 'MATH-102', TRUE),
('Prof. James Wilson', 'james.w@university.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Physics', 'JWL', 'PHY-LAB-3', TRUE);

-- Insert sample consultations
-- Dr. Sarah Johnson - Data Structures & Algorithms
INSERT INTO consultations (faculty_id, course_id, day_of_week, start_time, end_time, location) VALUES
(1, 1, 'Monday', '10:00:00', '12:00:00', 'Room 301, CS Building'),
(1, 1, 'Wednesday', '14:00:00', '16:00:00', 'Room 301, CS Building'),
(1, 2, 'Tuesday', '09:00:00', '11:00:00', 'Room 301, CS Building');

-- Prof. Michael Chen - Data Structures & Database Systems
INSERT INTO consultations (faculty_id, course_id, day_of_week, start_time, end_time, location) VALUES
(2, 1, 'Tuesday', '11:00:00', '12:30:00', 'Room 205, CS Building'),
(2, 1, 'Thursday', '15:00:00', '17:00:00', 'Room 205, CS Building'),
(2, 3, 'Wednesday', '10:00:00', '12:00:00', 'Room 205, CS Building');

-- Dr. Emily Rodriguez - Calculus & Linear Algebra
INSERT INTO consultations (faculty_id, course_id, day_of_week, start_time, end_time, location) VALUES
(3, 4, 'Monday', '13:00:00', '15:00:00', 'Math Building, Office 102'),
(3, 4, 'Friday', '10:00:00', '12:00:00', 'Math Building, Office 102'),
(3, 5, 'Wednesday', '11:00:00', '13:00:00', 'Math Building, Office 102');

-- Prof. James Wilson - Physics
INSERT INTO consultations (faculty_id, course_id, day_of_week, start_time, end_time, location) VALUES
(4, 6, 'Wednesday', '09:00:00', '11:00:00', 'Physics Lab 3'),
(4, 6, 'Thursday', '13:00:00', '14:30:00', 'Physics Lab 3'),
(4, 7, 'Tuesday', '14:00:00', '16:00:00', 'Physics Lab 3');

-- =============================================
-- USEFUL QUERIES FOR TESTING
-- =============================================

-- Get all consultations for a specific course
-- SELECT f.name, f.email, c.day_of_week, c.start_time, c.end_time, c.location
-- FROM consultations c
-- JOIN faculty f ON c.faculty_id = f.id
-- JOIN courses co ON c.course_id = co.id
-- WHERE co.course_name = 'Data Structures' AND f.is_registered = TRUE;

-- Get all pending requests for a faculty
-- SELECT cr.*, f.name as faculty_name
-- FROM consultation_requests cr
-- JOIN faculty f ON cr.faculty_id = f.id
-- WHERE cr.faculty_id = 1 AND cr.status = 'pending';

-- Get a student's routine
-- SELECT f.name, co.course_name, c.day_of_week, c.start_time, c.end_time, c.location
-- FROM routine_items ri
-- JOIN consultations c ON ri.consultation_id = c.id
-- JOIN faculty f ON c.faculty_id = f.id
-- JOIN courses co ON c.course_id = co.id
-- WHERE ri.student_email = 'student@example.com';