-- CreateTable
CREATE TABLE `payments` (
    `id` VARCHAR(36) NOT NULL,
    `method` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `external_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
