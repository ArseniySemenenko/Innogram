import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import * as bcrypt from "bcrypt";
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    saltRounds = 10;

    async create(dto: CreateUserDto) {
        const normalizedEmail = dto.email.toLowerCase().trim();
        const normalizedPhone = dto.phone.trim();
        const passwordHash = await bcrypt.hash(dto.password, this.saltRounds);

        try {
            return await this.prisma.user.create({
                data: {
                    name: dto.name.trim(),
                    email: normalizedEmail,
                    phone: normalizedPhone,
                    passwordHash: passwordHash,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    createdAt: true,
                    updatedAt: true,
                }
            })
        }
        catch (err) {
            return err;
        }
    }

    async findAll(take = 10, skip = 0) {
        return this.prisma.user.findMany({
            take: take,
            skip: skip,
            orderBy: { createdAt: "desc" }
        });
    }

    async findOne(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) throw new NotFoundException(`User with id ${id} not found`)

        return user;
    }

    async updateUser(id: string, dto: UpdateUserDto) {
        await this.findOne(id);
        
        if (dto.password) {
            return this.prisma.user.update({
                where: { id },
                data: {
                    name: dto.name,
                    email: dto.email.toLowerCase().trim(),
                    phone: dto.phone.trim(),
                    passwordHash: await bcrypt.hash(dto.password, this.saltRounds),
                },
            })
        }
        else {
            return this.prisma.user.update({
                where: { id },
                data: {
                    name: dto.name,
                    email: dto.email.toLowerCase().trim(),
                    phone: dto.phone.trim(),
                },
            })
        }
    }

    async removeUser(id: string) {
        return this.prisma.user.delete({ where: { id } });
    }
}
