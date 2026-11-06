import { Injectable } from '@nestjs/common';
import { PrismaClient } from "../generated/prisma/client.js";
import {PrismaPg} from "@prisma/adapter-pg";
import {OnModuleInit} from "@nestjs/common";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
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
            console.log("AUTH_MICROSERIVCE: DB CONNECTION STARTED")
        }
        catch (err) {
            console.log("AUTH_MICROSERIVC: ", err);
            throw err;
        }
    }

    async onModuleDestroy() {
        this.$disconnect();
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
