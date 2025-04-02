-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 02, 2025 at 06:13 AM
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
-- Table structure for table `business_cards`
--

CREATE TABLE `business_cards` (
  `id` varchar(36) NOT NULL,
  `company` varchar(50) NOT NULL,
  `description` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` varchar(25) NOT NULL,
  `website` varchar(50) NOT NULL,
  `address` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `business_cards`
--

INSERT INTO `business_cards` (`id`, `company`, `description`, `email`, `phone`, `website`, `address`, `created_at`, `updated_at`) VALUES
('06171a54-e80c-4e46-ba8b-2bdbc5851dbc', 'test5', 'this is test2', 'test@gmail.com', '0524567890', 'https://test.com', '123 Silicon Valley, CA', '2025-04-02 01:13:22', '2025-04-02 01:13:22'),
('5d519d9d-1423-4eea-b18a-c0eb74c3400d', 't232', 'thdasd', 'test@gmail.com', '0524567890', 'https://www.facebook.com', '123 Silicon Valley, CA', '2025-04-02 01:45:32', '2025-04-02 01:45:32'),
('727cc853-753b-4ec5-a7ca-908549b4b85f', 't2322', 'thdasd', 'test@gmail.com', '0524567890', 'https://www.facebook.com', '123 Silicon Valley, CA', '2025-04-02 01:14:40', '2025-04-02 01:14:40'),
('741d6a44-a98d-4576-958d-4aa76fd2e773', 'test2', 'this is test2', 'test12@gmail.com', '+1234567890', 'https://test.com', '123 Silicon Valley, CA', '2025-04-01 03:19:26', '2025-04-01 10:19:26'),
('74e121ec-0e96-11f0-80c6-feb49e4b3f7a', 'Test', 'this is a test', 'test@gmail.com', '052-3456789', 'www.test.com', 'this,is,a,test', '2025-04-01 01:13:01', '2025-04-03 01:11:20');

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
(2, 'ADMIN');

-- --------------------------------------------------------

--
-- Table structure for table `social_links`
--

CREATE TABLE `social_links` (
  `id` int(11) NOT NULL,
  `company_id` varchar(36) NOT NULL,
  `company` varchar(50) NOT NULL,
  `platform` varchar(50) NOT NULL,
  `url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `social_links`
--

INSERT INTO `social_links` (`id`, `company_id`, `company`, `platform`, `url`) VALUES
(1, '74e121ec-0e96-11f0-80c6-feb49e4b3f7a', 'Test', 'ins', 'teasfsad.co.il'),
(2, '74e121ec-0e96-11f0-80c6-feb49e4b3f7a', 'Test', 'Facebook', 'www.facebook.com');

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
  `roleId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userId`, `firstName`, `lastName`, `email`, `password`, `roleId`) VALUES
('20dd97e0-38a9-4f4d-88eb-79cac02d463c', 'user', 'test', 'test@gmail.com', '123456', 1),
('fc71adaf-2e06-4cde-9817-b625c60074ca', 'Bar', 'Zeitony', 'barzeitony@gmail.com', '123456', 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `business_cards`
--
ALTER TABLE `business_cards`
  ADD PRIMARY KEY (`id`);

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
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `social_links`
--
ALTER TABLE `social_links`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `social_links`
--
ALTER TABLE `social_links`
  ADD CONSTRAINT `social_links_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `business_cards` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
