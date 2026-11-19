ALTER TABLE "comments"
  ADD CONSTRAINT "comments_content_not_empty" CHECK (length(trim("content")) > 0);

ALTER TABLE "profiles"
  ADD CONSTRAINT "profiles_username_format" CHECK ("userName" ~ '^[a-zA-Z0-9_]{3,30}$');
