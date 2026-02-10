CREATE TABLE `settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`whatsappNumber` varchar(20) NOT NULL DEFAULT '+51999999999',
	`notificationEmail` varchar(255) NOT NULL DEFAULT 'gulianalulichacr048@gmail.com',
	`siteName` varchar(255) DEFAULT 'Regala Amor',
	`siteDescription` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `settings_id` PRIMARY KEY(`id`)
);
