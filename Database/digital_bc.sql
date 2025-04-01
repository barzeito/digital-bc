-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 01, 2025 at 05:58 AM
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
('741d6a44-a98d-4576-958d-4aa76fd2e773', 'test2', 'this is test2', 'test12@gmail.com', '+1234567890', 'https://test.com', '123 Silicon Valley, CA', '2025-04-01 03:19:26', '2025-04-01 10:19:26'),
('74e121ec-0e96-11f0-80c6-feb49e4b3f7a', 'Test', 'this is a test', 'test@gmail.com', '052-3456789', 'www.test.com', 'this,is,a,test', '2025-04-01 01:13:01', '2025-04-03 01:11:20');

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

--
-- Indexes for dumped tables
--

--
-- Indexes for table `business_cards`
--
ALTER TABLE `business_cards`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `social_links`
--
ALTER TABLE `social_links`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_id` (`company_id`);

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
