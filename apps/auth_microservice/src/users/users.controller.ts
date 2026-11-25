import { Controller, Post, HttpCode, HttpStatus, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UsersService } from './users.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { ApiCreatedResponse, ApiOperation , ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity.js';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    //create user
    @ApiOperation({ summary: "Create new user" })
    @ApiCreatedResponse({type: UserEntity , description: "User created"})
    @Post("create")
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() dto: CreateUserDto) {
        return this.usersService.create(dto);
    }

    //read all users
    @Get()
    @ApiOperation({ summary: "Get list of all users" })
    @ApiOkResponse({type: [UserEntity] , description: "Users list"})
    async findAll(@Body() dto?: { take: number, skip: number }) {
        return this.usersService.findAll(dto?.take , dto?.skip);
    }

    //read one user by id
    @Get(":id")
    @ApiOperation({ summary: "Get user by :ID" })
    @ApiOkResponse({ type: UserEntity, description: "User exists" })
    @ApiNotFoundResponse({description: "User not found"})
    async findOne(@Param("id") id: string) {
        return this.usersService.findOne(id);
    }

    //update user by id
    @Patch(":id")
    @ApiOperation({ summary: "Update user by :ID" })
    @ApiOkResponse({ type: UserEntity, description: "User updated" })
    @ApiNotFoundResponse({description: "User not found"})
    async update(@Param("id") id: string, @Body() dto: UpdateUserDto) {
        return this.usersService.updateUser(id, dto);
    }

    //delete user
    @Delete(":id")
    @ApiOperation({ summary: "Delete user by :ID" })
    @ApiOkResponse({ type: UserEntity, description: "User deleted" })
    @ApiNotFoundResponse({description: "User not found"})
    async remove(@Param("id") id: string) {
        return this.usersService.removeUser(id);
    }
}
