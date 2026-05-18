-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 18, 2026 at 02:15 PM
-- Server version: 9.1.0
-- PHP Version: 8.4.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `grievance_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `action_taken`
--

DROP TABLE IF EXISTS `action_taken`;
CREATE TABLE IF NOT EXISTS `action_taken` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ticket_id` varchar(50) DEFAULT NULL,
  `admin_id` int DEFAULT NULL,
  `action_notes` text,
  `updated_status` enum('PENDING','IN_PROGRESS','RESOLVED') DEFAULT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `ticket_id` (`ticket_id`),
  KEY `admin_id` (`admin_id`),
  KEY `ix_action_taken_id` (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
CREATE TABLE IF NOT EXISTS `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ix_admins_username` (`username`),
  KEY `ix_admins_id` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `password_hash`) VALUES
(1, 'admin@123', 'admin@123'),
(2, 'admin', 'admin123');

-- --------------------------------------------------------

--
-- Table structure for table `complaints`
--

DROP TABLE IF EXISTS `complaints`;
CREATE TABLE IF NOT EXISTS `complaints` (
  `ticket_id` varchar(50) NOT NULL,
  `citizen_name` varchar(100) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `description` text,
  `evidence_path` varchar(255) DEFAULT NULL,
  `predicted_category` varchar(100) DEFAULT NULL,
  `urgency_level` varchar(50) DEFAULT NULL,
  `priority_score` float DEFAULT NULL,
  `status` enum('PENDING','IN_PROGRESS','RESOLVED') DEFAULT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`ticket_id`),
  KEY `ix_complaints_ticket_id` (`ticket_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `complaints`
--

INSERT INTO `complaints` (`ticket_id`, `citizen_name`, `phone_number`, `district`, `city`, `location`, `description`, `evidence_path`, `predicted_category`, `urgency_level`, `priority_score`, `status`, `created_at`) VALUES
('TKT-BEE63390', 'Kumar', '928389', 'North District', NULL, 'Chennai', 'Garbage not collected', '/uploads/TKT-BEE63390.jpg', 'Sanitation Department', 'Medium', 51.37, 'PENDING', '2026-05-17 18:13:45'),
('TKT-3F6F63F1', 'Saran', '82989283928', 'North District', NULL, 'Chennai', 'Power Cut for 4 days', NULL, 'Electricity Department', 'High', 70.75, 'PENDING', '2026-05-17 18:15:32'),
('TKT-6642EDE9', 'Ramesh Kumar', '9876543210', 'North District', NULL, 'Main Street, Block A', 'A massive water pipe burst near the intersection. It is flooding the entire road and causing severe traffic blockages.', NULL, 'Water Supply Department', 'High', 65.03, 'RESOLVED', '2026-05-17 18:52:55'),
('TKT-4FFCA106', 'Priya Sharma', '9123456789', 'South District', NULL, 'Sector 4, Park Avenue', 'Garbage has not been collected from our locality for the past week. The smell is unbearable and it\'s a health hazard.', NULL, 'Sanitation Department', 'High', 84.92, 'RESOLVED', '2026-05-17 18:52:55'),
('TKT-406E0E4E', 'Abdul Rahman', '9988776655', 'East District', NULL, 'Market Road, Shop 42', 'There is a deep pothole in the middle of the road which has caused two minor accidents today. Needs urgent repair.', NULL, 'Roads Department', 'High', 71.75, 'PENDING', '2026-05-17 18:52:55'),
('TKT-8CD743A5', 'Sneha Gupta', '9876501234', 'West District', NULL, 'Lake View Apartments', 'Continuous power outage since yesterday evening. There are elderly people in the building who need electricity for medical devices.', NULL, 'Electricity Department', 'High', 62.48, 'PENDING', '2026-05-17 18:52:55'),
('TKT-C41D0BCE', 'Vikram Singh', '9012345678', 'Central District', NULL, 'Bus Stand, Platform 2', 'The public washrooms at the main bus terminal are in a very unhygienic condition. No water supply available.', NULL, 'Water Supply Department', 'High', 71.13, 'PENDING', '2026-05-17 18:52:55'),
('TKT-F57BE0D7', 'Anita Desai', '9345678120', 'North District', NULL, 'Government Hospital Road', 'Streetlights on the road leading to the hospital are not working. It is very dark and dangerous at night.', NULL, 'Electricity Department', 'High', 71.05, 'IN_PROGRESS', '2026-05-17 18:52:55'),
('TKT-CD2462D8', 'Manoj Tiwari', '9456123789', 'South District', NULL, 'Industrial Area, Phase 1', 'Chemical waste is being illegally dumped in the nearby open ground. Needs immediate inspection.', NULL, 'Sanitation Department', 'High', 72.13, 'RESOLVED', '2026-05-17 18:52:55'),
('TKT-01EE8007', 'Kavita Reddy', '9785634120', 'East District', NULL, 'Primary School, Village XYZ', 'The roof of the primary school building is leaking heavily during the rains. Very unsafe for children.', NULL, 'Sanitation Department', 'High', 76.04, 'IN_PROGRESS', '2026-05-17 18:52:55'),
('GRV10001', 'Arun Kumar', '9876543210', 'Coimbatore', NULL, 'Gandhipuram', 'Water leakage for the past 3 days near main road.', 'uploads/water1.jpg', 'Water Department', 'High', 10, 'PENDING', '2026-05-17 18:55:02'),
('GRV10002', 'Priya Sharma', '9123456780', 'Chennai', NULL, 'T Nagar', 'Street lights are not working properly.', 'uploads/light1.jpg', 'Electricity Department', 'Medium', 6, '', '2026-05-17 18:55:02'),
('GRV10003', 'Rahul Verma', '9988776655', 'Madurai', NULL, 'Anna Nagar', 'Road damaged badly causing accidents.', 'uploads/road1.jpg', 'Roads Department', 'High', 10, 'PENDING', '2026-05-17 18:55:02'),
('GRV10004', 'Sneha R', '9090909090', 'Salem', NULL, 'Fairlands', 'Garbage not cleaned for one week.', 'uploads/garbage1.jpg', 'Sanitation Department', 'Medium', 6, 'RESOLVED', '2026-05-17 18:55:02'),
('GRV10005', 'Karthik', '9000011111', 'Erode', NULL, 'Bus Stand', 'Drainage overflow causing bad smell.', 'uploads/drain1.jpg', 'Sanitation Department', 'High', 10, 'PENDING', '2026-05-17 18:55:02'),
('GRV10006', 'Divya', '9888899999', 'Trichy', NULL, 'Srirangam', 'No water supply for two days.', 'uploads/water2.jpg', 'Water Department', 'High', 10, '', '2026-05-17 18:55:02'),
('GRV10007', 'Vignesh', '9777766666', 'Coimbatore', NULL, 'RS Puram', 'Electric transformer making sparks.', 'uploads/electric1.jpg', 'Electricity Department', 'High', 10, 'PENDING', '2026-05-17 18:55:02'),
('GRV10008', 'Meena', '9555544444', 'Chennai', NULL, 'Velachery', 'Potholes creating traffic issues.', 'uploads/road2.jpg', 'Roads Department', 'Medium', 6, 'RESOLVED', '2026-05-17 18:55:02'),
('GRV10009', 'Suresh', '9666677777', 'Madurai', NULL, 'KK Nagar', 'Overflowing garbage bins attracting dogs.', 'uploads/garbage2.jpg', 'Sanitation Department', 'Medium', 6, 'PENDING', '2026-05-17 18:55:02'),
('GRV10010', 'Anitha', '9333344444', 'Salem', NULL, 'Hasthampatti', 'Frequent power cuts during night.', 'uploads/power1.jpg', 'Electricity Department', 'Low', 3, '', '2026-05-17 18:55:02'),
('TKT-FC60D2CD', 'Mani', '983489837', 'North District', NULL, 'Mumbai', 'Too much Traffic', NULL, 'Roads Department', 'Medium', 57.19, 'PENDING', '2026-05-18 19:44:03');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
