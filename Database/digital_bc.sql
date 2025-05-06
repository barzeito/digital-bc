-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 06, 2025 at 05:55 AM
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
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` int(11) NOT NULL,
  `company_id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `message` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `company_id`, `name`, `email`, `phone`, `date`, `time`, `message`) VALUES
(1, 'abc123', 'ישראלי ישראלי', 'israel@example.com', '0501234567', '2025-04-25', '14:30:00', 'רוצה פגישה דחופה'),
(6, 'f11addfa-9d66-443a-a3bc-67340b7d0110', 'ישראל ישראליי', 'israel@example.com', '0501234567', '2025-05-06', '05:30:00', 'רוצה פגישה דחופה'),
(13, 'f11addfa-9d66-443a-a3bc-67340b7d0110', 'בר ', 'bar199z51@gmail.com', '052-3456789', '2025-04-30', '07:40:00', 'בדיקה');

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
  `appAvailable` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `app_availability`
--

INSERT INTO `app_availability` (`appId`, `company_id`, `company`, `days_schedule`, `slot_interval`, `appAvailable`) VALUES
('e5e2da2a-b25c-4b60-a656-c24e2bf5e457', 'f11addfa-9d66-443a-a3bc-67340b7d0110', 'גשגש', '{\"sunday\":{\"start\":\"07:00\",\"end\":\"16:00\"},\"monday\":{\"start\":\"08:00\",\"end\":\"08:00\"},\"tuesday\":{\"start\":\"07:00\",\"end\":\"20:00\"},\"wednesday\":{\"start\":\"07:00\",\"end\":\"20:00\"},\"thursday\":{\"start\":\"07:00\",\"end\":\"20:00\"},\"friday\":{\"start\":\"07:00\",\"end\":\"20:00\"},\"saturday\":{\"start\":\"07:00\",\"end\":\"09:00\"}}', 10, 1);

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
  `ownedBy` char(36) DEFAULT NULL,
  `themeColor` varchar(10) NOT NULL,
  `backgroundColor` varchar(10) NOT NULL,
  `textColor` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `business_cards`
--

INSERT INTO `business_cards` (`id`, `company`, `coverImage`, `profileImage`, `name`, `description`, `about`, `email`, `phone`, `website`, `address`, `created_at`, `updated_at`, `ownedBy`, `themeColor`, `backgroundColor`, `textColor`) VALUES
('119034bc-1bea-4c05-aff2-8fe055b4e214', 'testthecode', NULL, NULL, 'משתמש', 'בדיקות', '', 'bar199z51@gmail.com', '0501234567', '', 'גשדג', '2025-05-04 21:56:11', '2025-05-05 04:56:11', 'a51b06eb-93a5-4169-8c22-79763b616b79', '#610000', '#424242', '#F4F5F6'),
('5a204d53-d65d-4bc9-8c93-1834f4c92965', 'dsfdfs', NULL, NULL, 'sdfsdafsdaf', 'sfsadf', '', 'bar199z51@gmail.com', '052-6773721', '', 'asdasd', '2025-04-27 20:44:45', '2025-04-28 03:44:45', '4bce0221-bf20-46d5-9cde-2942fd3fd144', '', '', ''),
('f11addfa-9d66-443a-a3bc-67340b7d0110', 'Digital Business Cards', '4b0689c4-de1d-499f-9bce-efc810ea9159.jpeg', '7fe9bcc9-30b1-4663-9a8e-9262ed1f2763.jpeg', 'בר זיתוני', 'כרטיסי ביקור דיגיטלים', '\r\n🎉 העתיד כבר כאן – ואתם עדיין בלי כרטיס דיגיטלי? 🧐\r\nבואו נעשה סדר: בעולם שבו הכל עובר לדיגיטל 📱, הגיע הזמן שגם אתם תעברו לשלב הבא ותציגו את עצמכם כמו מקצוענים אמיתיים 💼✨\r\n\r\nאנחנו ב-[שם החברה שלך] מתמחים ביצירת כרטיסים דיגיטליים מעוצבים אישית – כאלה שלא רק נראים מדהים 😍 אלא גם מייצגים אתכם בצורה הכי מקצועית שיש.\r\nכרטיס אחד. קישור אחד. כל מה שצריך לדעת עליך במקום אחד 👇\r\n\r\n🔗 קישורים לרשתות החברתיות\r\n📞 כפתור חיוג מהיר\r\n📍 ניווט לכתובת העסק\r\n🗓️ קביעת פגישות בלחיצת כפתור\r\n🖼️ גלריית תמונות\r\n📝 טופס יצירת קשר\r\n🎨 עיצוב אישי לפי המיתוג שלך\r\nועוד המון פיצ\'רים שיגרמו ללקוחות שלך להגיד: \"וואו, מאיפה זה?!\" 😮\r\n\r\n🛠️ איך זה עובד? פשוט מאוד:\r\n1️⃣ בוחרים עיצוב שמתאים לכם (או נותנים לנו לבנות אחד מותאם אישית 🎨)\r\n2️⃣ שולחים לנו פרטים בסיסיים\r\n3️⃣ מקבלים כרטיס דיגיטלי מוכן לשיתוף תוך 48 שעות! ⚡\r\n\r\n💡 למה דווקא אנחנו?\r\n✅ שירות אישי ומקצועי\r\n✅ תמיכה מהירה לכל שאלה\r\n✅ מחירים נוחים לכל כיס 💸\r\n✅ כרטיסים שמתעדכנים בלחיצת כפתור גם אחרי ההפצה\r\n\r\n🔥 אל תישארו מאחור – תנו ללקוחות שלכם סיבה לזכור אתכם!\r\n📲 צרו קשר עכשיו ותקבלו כרטיס ניסיון חינם!\r\n\r\n📩 דברו איתנו בוואטסאפ | 💬 השאירו פרטים בטופס | ☎️ חייגו אלינו\r\n\r\n', 'bar199z51@gmail.com', '052-3456789', 'www.wawa.com', 'כתובת תיהיה בקרוב', '2025-05-06 03:55:20', '2025-05-06 10:55:20', '4bce0221-bf20-46d5-9cde-2942fd3fd144', '#7542ff', '#424242', '#F4F5F6');

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
('0ab014cc-e48c-4cd9-b69a-27b825a66f06', '5a204d53-d65d-4bc9-8c93-1834f4c92965', 'dsfdfs', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('7763915b-97d5-4dc6-8dbb-c8538ede6e10', 'f11addfa-9d66-443a-a3bc-67340b7d0110', 'dff', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('c4dcdc5e-02ab-482f-b6d6-62a0015ae267', '119034bc-1bea-4c05-aff2-8fe055b4e214', 'testthecode', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

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
('4bce0221-bf20-46d5-9cde-2942fd3fd144', 'ישראל', 'ישראלי', 'bar199z51@gmail.com', '301200949421c4b6aac8cf1b8f3b2b48', 3, 0, NULL, NULL),
('62a98347-ffe4-4069-8128-55e9e08fc392', 'בר', 'זיתוני', 'barzeitony@gmail.com', '301200949421c4b6aac8cf1b8f3b2b48', 2, 0, 'b6b31f9f0e143d9e49f7c8e79853485648ba563f270fe0503ccda1d240cfe788', '2025-04-27 14:52:04'),
('a51b06eb-93a5-4169-8c22-79763b616b79', 'טסט', 'טסטי', 'bar199234@gmail.com', 'df1822609668e8fbcd73a1bfa213a876', 1, 0, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`);

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
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

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
