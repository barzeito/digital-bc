-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 14, 2025 at 06:41 AM
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

INSERT INTO `business_cards` (`id`, `company`, `name`, `description`, `about`, `email`, `phone`, `website`, `address`, `created_at`, `updated_at`, `ownedBy`) VALUES
('7ee3ae9e-31bd-4f1c-b403-940b587282dd', 'Digital Business Cards', 'Bar', 'כרטיסי ביקור דיגיטלים', '✨ כרטיסי ביקור דיגיטליים – הדרך החדשה להתחבר בעולם העסקי! ✨\n\nבימינו, כרטיס ביקור דיגיטלי הוא הרבה יותר מסתם פרטי יצירת קשר – הוא הדרך שלך להציג את עצמך בצורה מודרנית, נוחה ומרשימה! 🚀\n\n🔹 אינטראקטיבי וחדשני – כל פרטי העסק שלך במקום אחד, עם עיצובים מתקדמים שיבדל אותך מכל המתחרים. 🔹 עדכון מיידי – כל שינוי שתעשה בכרטיס הביקור יתעדכן בצורה אוטומטית, בלי לדאוג לכרטיסים פיזיים. 🔹 חוויית משתמש ידידותית – כרטיסי הביקור הדיגיטליים שלנו נגישים, קלים לשיתוף, וללא מגבלות על כמות המידע. 🔹 שיתוף קל ונוח – שיתוף הכרטיס דרך קישור, קוד QR או דרך רשתות חברתיות. 📲\n\n✅ כרטיס ביקור דיגיטלי לא רק שתורם למראה המקצועי שלך, אלא גם חוסך זמן ומשאבים. פשוט, נוח, ומרשים!\n\nמהחברה שלך ועד לכל לקוח פוטנציאלי – כרטיס ביקור דיגיטלי הוא הכלי המושלם לכל תחום! 💼\n\nהצטרף למהפכת הדיגיטל והתחל לשתף את כרטיס הביקור שלך בצורה חכמה ויעילה!\n\n📩 צרו קשר עכשיו וגלו איך אנחנו יכולים לשדרג את הפרופיל העסקי שלכם! 🌟', 'barzeitony@gmail.com', '052-3456789', 'www.soon.com', 'כתובת תיהיה בקרוב', '2025-04-13 23:47:48', '2025-04-14 06:47:48', '200e5ccd-1e80-4fee-b48a-b5118e0508cf');

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
('801dcf63-61cf-4263-b853-c12f25aa1982', '7ee3ae9e-31bd-4f1c-b403-940b587282dd', 'dfsdf', 'www.facebook.com', 'www.instagram.com', 'www.jhjhj.com', NULL, NULL, NULL, NULL, NULL, NULL);

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
('200e5ccd-1e80-4fee-b48a-b5118e0508cf', 'Bar', 'Zeitony', 'bar199234@gmail.com', '301200949421c4b6aac8cf1b8f3b2b48', 1, 0, NULL, NULL),
('4bce0221-bf20-46d5-9cde-2942fd3fd144', 'משתמש חדש', 'משתמש חדש', 'bar199z51@gmail.com', '301200949421c4b6aac8cf1b8f3b2b48', 1, 0, NULL, NULL),
('62a98347-ffe4-4069-8128-55e9e08fc392', 'בר', 'זיתוני', 'barzeitony@gmail.com', '301200949421c4b6aac8cf1b8f3b2b48', 2, 0, 'a4c9c4c9f894962c292bf06fc37cdba9310d8948946b3ab6526a91dfb6b03875', '2025-04-03 17:58:51');

--
-- Indexes for dumped tables
--

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
