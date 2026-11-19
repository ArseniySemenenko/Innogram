import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { PostsModule } from './posts/posts.module.js';
import { CommentsModule } from './comments/comments.module.js';
import { ChatsModule } from './chats/chats.module.js';

@Module({
  imports: [PrismaModule, PostsModule, CommentsModule, ChatsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
