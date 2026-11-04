/*
  Warnings:

  - You are about to drop the column `postId` on the `assets` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "assets" DROP CONSTRAINT "assets_postId_fkey";

-- DropIndex
DROP INDEX "assets_postId_idx";

-- AlterTable
ALTER TABLE "assets" DROP COLUMN "postId";

ALTER TABLE "comments"
  ADD CONSTRAINT "comments_content_not_empty" CHECK (length(trim("content")) > 0);

ALTER TABLE "profiles"
  ADD CONSTRAINT "profiles_username_format" CHECK ("userName" ~ '^[a-zA-Z0-9_]{3,30}$');
