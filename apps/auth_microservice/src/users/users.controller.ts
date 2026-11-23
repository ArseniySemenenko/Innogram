import { Controller, Post, HttpCode, HttpStatus, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UsersService } from './users.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    //create user
    @Post("create")
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() dto: CreateUserDto) {
        return this.usersService.create(dto);
    }

    //read all users
    @Get()
    async findAll(@Body() dto?: { take: number, skip: number }) {
        return this.usersService.findAll(dto?.take , dto?.skip);
    }

    //read one user by id
    @Get(":id")
    async findOne(@Param("id") id: string) {
        return this.usersService.findOne(id);
    }

    //update user by id
    @Patch(":id")
    async update(@Param("id") id: string, @Body() dto: UpdateUserDto) {
        return this.usersService.updateUser(id, dto);
    }

    //delete user
    @Delete(":id")
    async remove(@Param("id") id: string) {
        return this.usersService.removeUser(id);
    }
}
