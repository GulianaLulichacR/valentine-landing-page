CREATE TABLE `auditLog` (
	`id` int AUTO_INCREMENT NOT NULL,
	`action` varchar(100) NOT NULL,
	`entityType` varchar(100),
	`entityId` int,
	`userId` int,
	`changes` json,
	`ipAddress` varchar(45),
	`userAgent` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `auditLog_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`productName` varchar(255) NOT NULL,
	`productPrice` decimal(10,2) NOT NULL,
	`senderName` varchar(255) NOT NULL,
	`senderEmail` varchar(255),
	`senderPhone` varchar(20),
	`recipientName` varchar(255) NOT NULL,
	`message` text,
	`deliveryDate` varchar(50) NOT NULL,
	`paymentStatus` enum('pending','confirmed','failed','refunded') DEFAULT 'pending',
	`paymentMethod` varchar(100),
	`paymentDate` timestamp,
	`transactionId` varchar(255),
	`termsAccepted` int NOT NULL DEFAULT 0,
	`minDeliveryDays` int NOT NULL DEFAULT 2,
	`noRefundPolicy` int NOT NULL DEFAULT 1,
	`orderStatus` enum('pending','confirmed','processing','shipped','delivered','cancelled') DEFAULT 'pending',
	`notes` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`currency` varchar(3) DEFAULT 'PEN',
	`paymentMethod` varchar(100) NOT NULL,
	`status` enum('pending','completed','failed','refunded') DEFAULT 'pending',
	`transactionId` varchar(255),
	`description` text,
	`metadata` json,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`),
	CONSTRAINT `payments_transactionId_unique` UNIQUE(`transactionId`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`price` decimal(10,2) NOT NULL,
	`imageUrl` varchar(500),
	`category` varchar(100) DEFAULT 'San Valentin',
	`stock` int DEFAULT 0,
	`featured` int DEFAULT 0,
	`complements` json,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255),
	`name` varchar(255),
	`phone` varchar(20),
	`role` enum('customer','admin') DEFAULT 'customer',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
