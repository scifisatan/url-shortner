CREATE TABLE `urls` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`short_code` text NOT NULL,
	`original_url` text NOT NULL,
	`created_at` integer NOT NULL,
	`clicks` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `urls_short_code_unique` ON `urls` (`short_code`);