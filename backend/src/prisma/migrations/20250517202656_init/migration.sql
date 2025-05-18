-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `last_name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    `is_verified` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vehicles` (
    `id` VARCHAR(191) NOT NULL,
    `plate_number` VARCHAR(191) NOT NULL,
    `vehicle_type` ENUM('CAR', 'BIKE', 'TRUCK') NOT NULL,
    `size` ENUM('SMALL', 'MEDIUM', 'LARGE') NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `maker` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `vehicles_plate_number_key`(`plate_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `slot_requests` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `vehicle_id` VARCHAR(191) NOT NULL,
    `slot_id` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `parking_slots` (
    `id` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NOT NULL,
    `size` ENUM('SMALL', 'MEDIUM', 'LARGE') NOT NULL,
    `vehicleType` ENUM('CAR', 'BIKE', 'TRUCK') NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `status` ENUM('AVAILABLE', 'UNAVAILABLE') NOT NULL DEFAULT 'AVAILABLE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `parking_slots_number_key`(`number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `parking_sessions` (
    `id` VARCHAR(191) NOT NULL,
    `start_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `end_time` DATETIME(3) NULL,
    `payment_status` ENUM('PENDING', 'PAID') NOT NULL DEFAULT 'PENDING',
    `plate_number` VARCHAR(191) NOT NULL,
    `is_exited` BOOLEAN NOT NULL DEFAULT false,
    `slot_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `id` VARCHAR(191) NOT NULL,
    `sessionId` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `method` ENUM('CASH', 'CARD', 'MOBILE') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `payments_sessionId_key`(`sessionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `otps` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `otp_code` VARCHAR(191) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `is_verified` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vehicle_transfers` (
    `id` VARCHAR(191) NOT NULL,
    `vehicle_id` VARCHAR(191) NOT NULL,
    `from_user_id` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `to_user_id` VARCHAR(191) NOT NULL,
    `transfer_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `price` DOUBLE NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `vehicles` ADD CONSTRAINT `vehicles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `slot_requests` ADD CONSTRAINT `slot_requests_slot_id_fkey` FOREIGN KEY (`slot_id`) REFERENCES `parking_slots`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `slot_requests` ADD CONSTRAINT `slot_requests_vehicle_id_fkey` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `slot_requests` ADD CONSTRAINT `slot_requests_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `parking_sessions` ADD CONSTRAINT `parking_sessions_slot_id_fkey` FOREIGN KEY (`slot_id`) REFERENCES `parking_slots`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `parking_sessions` ADD CONSTRAINT `parking_sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `parking_sessions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vehicle_transfers` ADD CONSTRAINT `vehicle_transfers_vehicle_id_fkey` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vehicle_transfers` ADD CONSTRAINT `vehicle_transfers_from_user_id_fkey` FOREIGN KEY (`from_user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vehicle_transfers` ADD CONSTRAINT `vehicle_transfers_to_user_id_fkey` FOREIGN KEY (`to_user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
