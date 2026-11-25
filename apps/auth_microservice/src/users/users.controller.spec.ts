import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser = {
    id: 'user-uuid-123',
    email: 'test@example.com',
    name: 'Test User',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUsersService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    updateUser: vi.fn(),
    removeUser: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user and return it', async () => {
      const dto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      } as CreateUserDto;

      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users with pagination params', async () => {
      const paginationDto = { take: 10, skip: 0 };
      const usersList = [mockUser];

      mockUsersService.findAll.mockResolvedValue(usersList);

      const result = await controller.findAll(paginationDto);

      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(service.findAll).toHaveBeenCalledWith(10, 0);
      expect(result).toEqual(usersList);
    });

    it('should call service.findAll with undefined params if body is not provided', async () => {
      const usersList = [mockUser];
      mockUsersService.findAll.mockResolvedValue(usersList);

      const result = await controller.findAll(undefined);

      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(service.findAll).toHaveBeenCalledWith(undefined, undefined);
      expect(result).toEqual(usersList);
    });
  });

  describe('findOne', () => {
    it('should return a single user by id', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne(mockUser.id);

      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockUser);
    });

    it('should propagate NotFoundException if user does not exist', async () => {
      mockUsersService.findOne.mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith('non-existent-id');
    });
  });

  describe('update', () => {
    it('should update a user and return updated entity', async () => {
      const dto = { name: 'Updated Name' } as UpdateUserDto;
      const updatedUser = { ...mockUser, ...dto };

      mockUsersService.updateUser.mockResolvedValue(updatedUser);

      const result = await controller.update(mockUser.id, dto);

      expect(service.updateUser).toHaveBeenCalledTimes(1);
      expect(service.updateUser).toHaveBeenCalledWith(mockUser.id, dto);
      expect(result).toEqual(updatedUser);
    });

    it('should propagate NotFoundException when updating non-existent user', async () => {
      const dto = { name: 'Updated Name' } as UpdateUserDto;
      mockUsersService.updateUser.mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.update('non-existent-id', dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a user and return deleted entity', async () => {
      mockUsersService.removeUser.mockResolvedValue(mockUser);

      const result = await controller.remove(mockUser.id);

      expect(service.removeUser).toHaveBeenCalledTimes(1);
      expect(service.removeUser).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockUser);
    });

    it('should propagate NotFoundException when deleting non-existent user', async () => {
      mockUsersService.removeUser.mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.remove('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });
});