-- CreateTable
CREATE TABLE `lugar_vistas` (
    `id` VARCHAR(191) NOT NULL,
    `visitorId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lugarId` VARCHAR(191) NOT NULL,
    `usuarioId` VARCHAR(191) NULL,

    INDEX `lugar_vistas_lugarId_idx`(`lugarId`),
    INDEX `lugar_vistas_usuarioId_idx`(`usuarioId`),
    INDEX `lugar_vistas_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `lugar_vistas` ADD CONSTRAINT `lugar_vistas_lugarId_fkey` FOREIGN KEY (`lugarId`) REFERENCES `lugares`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lugar_vistas` ADD CONSTRAINT `lugar_vistas_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
