-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 24, 2025 at 06:14 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `digital_bc`
--
CREATE DATABASE IF NOT EXISTS `digital_bc` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `digital_bc`;

-- --------------------------------------------------------

--
-- Table structure for table `app_availability`
--

CREATE TABLE `app_availability` (
  `appId` varchar(36) NOT NULL,
  `company_id` varchar(36) NOT NULL,
  `company` varchar(255) NOT NULL,
  `days_schedule` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`days_schedule`)),
  `slot_interval` int(11) NOT NULL DEFAULT 30,
  `booked_appointments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]' CHECK (json_valid(`booked_appointments`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `app_availability`
--

INSERT INTO `app_availability` (`appId`, `company_id`, `company`, `days_schedule`, `slot_interval`, `booked_appointments`) VALUES
('e5e2da2a-b25c-4b60-a656-c24e2bf5e457', 'f11addfa-9d66-443a-a3bc-67340b7d0110', 'גשגש', '{\"sunday\":{\"start\":\"07:00\",\"end\":\"16:00\"},\"monday\":{\"start\":\"08:00\",\"end\":\"08:00\"},\"tuesday\":{\"start\":\"07:00\",\"end\":\"20:00\"},\"wednesday\":{\"start\":\"07:00\",\"end\":\"20:00\"},\"thursday\":{\"start\":\"07:00\",\"end\":\"20:00\"},\"friday\":{\"start\":\"07:00\",\"end\":\"20:00\"},\"saturday\":{\"start\":\"07:00\",\"end\":\"20:00\"}}', 30, '[\"{\\\"name\\\":\\\"ddddd\\\",\\\"email\\\":\\\"bar199z51@gmail.com\\\",\\\"phone\\\":\\\"052-6773721\\\",\\\"date\\\":\\\"2025-04-25\\\",\\\"time\\\":\\\"07:00\\\",\\\"message\\\":\\\"cshev\\\",\\\"appointmentDate\\\":\\\"2025-04-25\\\"}\", \"{\\\"name\\\":\\\"ddddd\\\",\\\"email\\\":\\\"bar199z51@gmail.com\\\",\\\"phone\\\":\\\"052-6773721\\\",\\\"date\\\":\\\"2025-04-25\\\",\\\"time\\\":\\\"07:00\\\",\\\"message\\\":\\\"cshev\\\",\\\"appointmentDate\\\":\\\"2025-04-25\\\"}\", \"{\\\"name\\\":\\\"gfdgdf\\\",\\\"email\\\":\\\"barzeitony@gmail.com\\\",\\\"phone\\\":\\\"052-3242342\\\",\\\"date\\\":\\\"2025-04-25\\\",\\\"time\\\":\\\"10:00\\\",\\\"message\\\":\\\"asdsd\\\",\\\"appointmentDate\\\":\\\"2025-04-25\\\"}\", \"{\\\"name\\\":\\\"dsfdsf\\\",\\\"email\\\":\\\"bar199z51@gmail.com\\\",\\\"phone\\\":\\\"052-3456789\\\",\\\"date\\\":\\\"2025-04-30\\\",\\\"time\\\":\\\"08:00\\\",\\\"message\\\":\\\"asdads\\\",\\\"appointmentDate\\\":\\\"2025-04-30\\\"}\", \"{\\\"name\\\":\\\"ddddd\\\",\\\"email\\\":\\\"bar199z51@gmail.com\\\",\\\"phone\\\":\\\"052-3456789\\\",\\\"date\\\":\\\"2025-04-30\\\",\\\"time\\\":\\\"08:30\\\",\\\"message\\\":\\\"okokokko\\\",\\\"appointmentDate\\\":\\\"2025-04-30\\\"}\", \"{\\\"name\\\":\\\"ddddd\\\",\\\"email\\\":\\\"bar199z51@gmail.com\\\",\\\"phone\\\":\\\"052-6773721\\\",\\\"date\\\":\\\"2025-04-30\\\",\\\"time\\\":\\\"07:30\\\",\\\"message\\\":\\\"sdfda\\\",\\\"appointmentDate\\\":\\\"2025-04-30\\\"}\"]');

-- --------------------------------------------------------

--
-- Table structure for table `business_cards`
--

CREATE TABLE `business_cards` (
  `id` varchar(36) NOT NULL,
  `company` varchar(50) NOT NULL,
  `coverImage` varchar(255) DEFAULT NULL,
  `profileImage` varchar(255) DEFAULT NULL,
  `name` varchar(25) NOT NULL,
  `description` varchar(50) NOT NULL,
  `about` text NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` varchar(25) NOT NULL,
  `website` varchar(50) NOT NULL,
  `address` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `ownedBy` char(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `business_cards`
--

INSERT INTO `business_cards` (`id`, `company`, `coverImage`, `profileImage`, `name`, `description`, `about`, `email`, `phone`, `website`, `address`, `created_at`, `updated_at`, `ownedBy`) VALUES
('ced48544-804f-464a-8d7a-814f56785fae', 'dsfdsf', NULL, NULL, 'dsfsdfsd', 'fsdf', '', 'nana@gmail.com', '052-3456789', '', 'dddd', '2025-04-20 19:29:31', '2025-04-21 02:29:31', NULL),
('f11addfa-9d66-443a-a3bc-67340b7d0110', 'Digital Business Cards', '43d4e1e1-4fe3-4dc3-a268-8f915fef6d32.jpeg', '8a628444-47ce-44e4-8c31-44f20c4c73c0.jpeg', 'ddddd', 'dddd', 'jjii', 'bar199z51@gmail.com', '052-3456789', 'www.wawa.com', 'dddd', '2025-04-23 03:35:59', '2025-04-23 10:35:59', '4bce0221-bf20-46d5-9cde-2942fd3fd144');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `roleId` int(11) NOT NULL,
  `roleName` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`roleId`, `roleName`) VALUES
(1, 'USER'),
(2, 'ADMIN'),
(3, 'PREMIUM');

-- --------------------------------------------------------

--
-- Table structure for table `social_links`
--

CREATE TABLE `social_links` (
  `id` char(36) NOT NULL,
  `company_id` varchar(36) NOT NULL,
  `company` varchar(50) NOT NULL,
  `facebook` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `linkedin` varchar(255) DEFAULT NULL,
  `twitter` varchar(255) DEFAULT NULL,
  `whatsapp` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `map` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `tiktok` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `social_links`
--

INSERT INTO `social_links` (`id`, `company_id`, `company`, `facebook`, `instagram`, `linkedin`, `twitter`, `whatsapp`, `email`, `map`, `phone`, `tiktok`) VALUES
('15a5a776-fe86-43e5-89c9-d59ea3525453', 'ced48544-804f-464a-8d7a-814f56785fae', 'dsfdsf', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('7763915b-97d5-4dc6-8dbb-c8538ede6e10', 'f11addfa-9d66-443a-a3bc-67340b7d0110', 'dff', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userId` char(36) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `roleId` int(11) NOT NULL,
  `isTemporaryPassword` tinyint(1) DEFAULT 1,
  `resetPasswordToken` varchar(255) DEFAULT NULL,
  `resetPasswordExpires` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userId`, `firstName`, `lastName`, `email`, `password`, `roleId`, `isTemporaryPassword`, `resetPasswordToken`, `resetPasswordExpires`) VALUES
('4bce0221-bf20-46d5-9cde-2942fd3fd144', 'משתמש חדש', 'משתמש חדש', 'bar199z51@gmail.com', '301200949421c4b6aac8cf1b8f3b2b48', 3, 0, NULL, NULL),
('62a98347-ffe4-4069-8128-55e9e08fc392', 'בר', 'זיתוני', 'barzeitony@gmail.com', '301200949421c4b6aac8cf1b8f3b2b48', 2, 0, 'a4c9c4c9f894962c292bf06fc37cdba9310d8948946b3ab6526a91dfb6b03875', '2025-04-03 17:58:51');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `app_availability`
--
ALTER TABLE `app_availability`
  ADD PRIMARY KEY (`appId`),
  ADD KEY `company_id` (`company_id`);

--
-- Indexes for table `business_cards`
--
ALTER TABLE `business_cards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ownedBy` (`ownedBy`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`roleId`);

--
-- Indexes for table `social_links`
--
ALTER TABLE `social_links`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_id` (`company_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`),
  ADD KEY `roleId` (`roleId`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `business_cards`
--
ALTER TABLE `business_cards`
  ADD CONSTRAINT `business_cards_ibfk_1` FOREIGN KEY (`ownedBy`) REFERENCES `users` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `social_links`
--
ALTER TABLE `social_links`
  ADD CONSTRAINT `social_links_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `business_cards` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
