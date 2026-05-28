-- CreateTable
CREATE TABLE `reportes` (
    `id` VARCHAR(191) NOT NULL,
    `motivo` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `resenaId` VARCHAR(191) NOT NULL,
    `lugarId` VARCHAR(191) NOT NULL,
    `reportadoPor` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `reportes_resenaId_reportadoPor_key`(`resenaId`, `reportadoPor`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `reportes` ADD CONSTRAINT `reportes_resenaId_fkey` FOREIGN KEY (`resenaId`) REFERENCES `resenas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reportes` ADD CONSTRAINT `reportes_reportadoPor_fkey` FOREIGN KEY (`reportadoPor`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
