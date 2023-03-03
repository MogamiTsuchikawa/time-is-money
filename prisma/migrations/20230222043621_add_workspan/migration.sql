-- AlterTable
ALTER TABLE `User` ADD COLUMN `moneyPerHour` INTEGER NOT NULL DEFAULT 1000;

-- CreateTable
CREATE TABLE `WorkSpan` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `startAt` DATETIME(3) NOT NULL,
    `endAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WorkSpan` ADD CONSTRAINT `WorkSpan_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
