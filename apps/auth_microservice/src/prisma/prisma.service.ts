import { Injectable, OnModuleDestroy, Logger} from '@nestjs/common';
import {PrismaClient} from "../generated/prisma/client.js";
import {PrismaPg} from "@prisma/adapter-pg";
import {OnModuleInit} from "@nestjs/common";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);
    
    constructor() {
        super({
            adapter: new PrismaPg({
                connectionString: process.env.DATABASE_URL,
                max: 10,
                connectionTimeoutMillis: 2000,
            })
        });
    }

    async onModuleInit() {
        try {
            await this.$queryRaw`SELECT 1`;
            this.logger.log("AUTH_MICROSERVICE: DB CONNECTION STARTED")
        }
        catch (err) {
            this.logger.log("AUTH_MICROSERIVC: ", err);
            throw err;
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }

    async healthCheck() {
      try {
        await this.$queryRaw`SELECT 1`;
        return true;
      } catch {
        return false;
      }
    }
}
