import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service.js";

@Injectable()
export class AppService {

    constructor(private readonly prisma: PrismaService){}
    
    async healthCheck() {
        if (await this.prisma.healthCheck()) {
            return true;
        }

        else return false;
    }
}
