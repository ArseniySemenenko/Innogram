import { Injectable } from '@nestjs/common';
import {PrismaClient} from "../../generated/prisma/client.js"
import {PrismaPg} from "@prisma/adapter-pg";
import {OnModuleInit} from "@nestjs/common";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        super({
            adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
        });
    }

    async onModuleInit() {
        await this.$connect();
    }
}
