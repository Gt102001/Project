-- ========================================================
-- AegisEdu Database Initialization & Schema
-- Database: student
-- ========================================================

CREATE DATABASE IF NOT EXISTS `student`;
USE `student`;

-- 1. Student Records Table
CREATE TABLE IF NOT EXISTS `student_data` (
  `Sr_No` INT AUTO_INCREMENT PRIMARY KEY,
  `Name` VARCHAR(255) NOT NULL,
  `Standard` VARCHAR(50) NOT NULL,
  `Section` VARCHAR(10) NOT NULL DEFAULT 'A',
  `Roll_No` VARCHAR(50) NOT NULL,
  `Email` VARCHAR(255),
  `Phone` VARCHAR(50),
  `Gender` VARCHAR(20) DEFAULT 'Other',
  `DOB` VARCHAR(50),
  `Blood_Group` VARCHAR(10),
  `Address` TEXT,
  `Father_Name` VARCHAR(255),
  `Mother_Name` VARCHAR(255),
  `Emergency_Contact` VARCHAR(50),
  `Medical_History` TEXT,
  `Fees_Status` VARCHAR(50) DEFAULT 'Pending',
  `Fees_Amount` DECIMAL(10,2) DEFAULT 18500.00,
  `Fees_Paid` DECIMAL(10,2) DEFAULT 0.00,
  `Attendance` INT DEFAULT 85,
  `GPA` VARCHAR(10) DEFAULT 'A',
  `Remarks` TEXT,
  `Avatar` TEXT
);

-- 2. Institutional Users & Roles
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'student',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Institutional Notices & Bulletins
CREATE TABLE IF NOT EXISTS `notices` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `category` VARCHAR(100) DEFAULT 'General',
  `author` VARCHAR(100) DEFAULT 'Administration',
  `pinned` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Audit & Security Activity Logs
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `action` VARCHAR(100) NOT NULL,
  `actor` VARCHAR(100) NOT NULL,
  `details` TEXT,
  `ip_address` VARCHAR(50),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- Sample Seed Data
-- ========================================================

-- Seed Admin & Faculty Users
INSERT IGNORE INTO `users` (`id`, `username`, `email`, `password`, `role`) VALUES
(1, 'admin', 'admin@aegisedu.ac.in', 'Admin@2026', 'admin'),
(2, 'faculty_smith', 'smith@aegisedu.ac.in', 'Faculty@123', 'faculty'),
(3, 'student_alex', 'alex.turner@aegisedu.ac.in', 'Student@123', 'student');

-- Seed Sample Students
INSERT INTO `student_data` 
(`Name`, `Standard`, `Section`, `Roll_No`, `Email`, `Phone`, `Gender`, `DOB`, `Blood_Group`, `Address`, `Father_Name`, `Mother_Name`, `Emergency_Contact`, `Fees_Status`, `Fees_Amount`, `Fees_Paid`, `Attendance`, `GPA`, `Remarks`, `Avatar`)
VALUES
('Alex Turner', '10th', 'A', '10A-01', 'alex.turner@student.edu', '+91 98765 43210', 'Male', '2008-04-12', 'O+', '42 Highgrove Street, Campus Lane', 'Arthur Turner', 'Eleanor Turner', '+91 98765 11111', 'Paid', 18500.00, 18500.00, 94, 'A+', 'Consistently high performer in STEM disciplines.', 'https://api.dicebear.com/7.x/bottts/svg?seed=AlexTurner'),
('Sophia Martinez', '10th', 'A', '10A-02', 'sophia.m@student.edu', '+91 98765 43211', 'Female', '2008-07-25', 'A+', '18 Horizon Crescent, Sector 4', 'Carlos Martinez', 'Elena Martinez', '+91 98765 22222', 'Partial', 18500.00, 12000.00, 89, 'A', 'Active in student council and debate team.', 'https://api.dicebear.com/7.x/bottts/svg?seed=SophiaMartinez'),
('Rohan Sharma', '11th', 'B', '11B-05', 'rohan.sharma@student.edu', '+91 98765 43212', 'Male', '2007-11-03', 'B+', '88 Greenwood Boulevard, Sector 12', 'Rajesh Sharma', 'Sunita Sharma', '+91 98765 33333', 'Pending', 22000.00, 0.00, 78, 'B+', 'Needs improvement in physics lab submissions.', 'https://api.dicebear.com/7.x/bottts/svg?seed=RohanSharma'),
('Ananya Patel', '12th', 'A', '12A-11', 'ananya.patel@student.edu', '+91 98765 43213', 'Female', '2006-09-15', 'AB+', '104 Lakeview Enclave, City South', 'Vikram Patel', 'Meera Patel', '+91 98765 44444', 'Paid', 25000.00, 25000.00, 98, 'A+', 'Top ranker in regional mathematics olympiad.', 'https://api.dicebear.com/7.x/bottts/svg?seed=AnanyaPatel');

-- Seed Sample Notices
INSERT INTO `notices` (`title`, `content`, `category`, `author`, `pinned`) VALUES
('Mid-Term Examination Schedule Released', 'The Mid-Term Examination schedule for standard 9 through 12 has been published. All examinations will commence from next Monday at 09:00 AM IST.', 'Academic', 'Dean of Academics', 1),
('Annual Sports & Athletics Meet 2026', 'Registrations are now open for track and field events. Please contact the physical education department before Friday.', 'Events', 'Sports Dept', 0),
('Campus IT Maintenance Window', 'Routine database maintenance will occur this Sunday between 02:00 AM and 04:00 AM. Student portal may experience momentary downtime.', 'System', 'IT Admin', 0);

-- Seed System Boot Log
INSERT INTO `audit_logs` (`action`, `actor`, `details`, `ip_address`) VALUES
('SYSTEM_BOOT', 'SYSTEM', 'AegisEdu Core Engine Online & Schema Initialized', '127.0.0.1');
