-- CreateTable
CREATE TABLE "post_assets" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_follows" (
    "id" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profile_follows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_participants" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_assets" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_likes" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment_likes" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "post_assets_assetId_idx" ON "post_assets"("assetId");

-- CreateIndex
CREATE UNIQUE INDEX "post_assets_postId_assetId_key" ON "post_assets"("postId", "assetId");

-- CreateIndex
CREATE INDEX "profile_follows_followingId_idx" ON "profile_follows"("followingId");

-- CreateIndex
CREATE UNIQUE INDEX "profile_follows_followerId_followingId_key" ON "profile_follows"("followerId", "followingId");

-- CreateIndex
CREATE INDEX "chat_participants_profileId_idx" ON "chat_participants"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "chat_participants_chatId_profileId_key" ON "chat_participants"("chatId", "profileId");

-- CreateIndex
CREATE INDEX "message_assets_assetId_idx" ON "message_assets"("assetId");

-- CreateIndex
CREATE UNIQUE INDEX "message_assets_messageId_assetId_key" ON "message_assets"("messageId", "assetId");

-- CreateIndex
CREATE INDEX "post_likes_profileId_idx" ON "post_likes"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "post_likes_postId_profileId_key" ON "post_likes"("postId", "profileId");

-- CreateIndex
CREATE INDEX "comment_likes_profileId_idx" ON "comment_likes"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "comment_likes_commentId_profileId_key" ON "comment_likes"("commentId", "profileId");

-- AddForeignKey
ALTER TABLE "post_assets" ADD CONSTRAINT "post_assets_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_assets" ADD CONSTRAINT "post_assets_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_follows" ADD CONSTRAINT "profile_follows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_follows" ADD CONSTRAINT "profile_follows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_participants" ADD CONSTRAINT "chat_participants_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_participants" ADD CONSTRAINT "chat_participants_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_assets" ADD CONSTRAINT "message_assets_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_assets" ADD CONSTRAINT "message_assets_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "profile_follows"
  ADD CONSTRAINT "profile_follows_no_self_follow"
  CHECK ("followerId" <> "followingId");
