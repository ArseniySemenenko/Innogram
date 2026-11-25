import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

vi.mock('bcrypt', () => ({
  hash: vi.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const userSelectFields = {
    id: true,
    name: true,
    email: true,
    phone: true,
    createdAt: true,
    updatedAt: true,
  };

  const mockUser = {
    id: 'user-uuid-123',
    name: 'Test User',
    email: 'test@example.com',
    phone: '+1234567890',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  const mockPrismaService = {
    user: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreateUserDto = {
      name: '  Test User  ',
      email: '  TEST@Example.COM  ',
      phone: '  +1234567890  ',
      password: 'plainPassword123',
    };

    it('should normalize fields, hash password, and create user', async () => {
      vi.mocked(bcrypt.hash).mockResolvedValue('hashedPassword123' as never);
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await service.create(createDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('plainPassword123', 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          phone: '+1234567890',
          passwordHash: 'hashedPassword123',
        },
        select: userSelectFields,
      });
      expect(result).toEqual(mockUser);
    });

    it('should return error object if prisma throws (current implementation behavior)', async () => {
      const dbError = new Error('Unique constraint failed');
      vi.mocked(bcrypt.hash).mockResolvedValue('hashedPassword123' as never);
      mockPrismaService.user.create.mockRejectedValue(dbError);

      const result = await service.create(createDto);

      expect(result).toBe(dbError);
    });
  });

  describe('findAll', () => {
    it('should return paginated users with default parameters', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([mockUser]);

      const result = await service.findAll();

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
        orderBy: { createdAt: 'desc' },
        select: userSelectFields,
      });
      expect(result).toEqual([mockUser]);
    });

    it('should pass custom take and skip parameters to prisma', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([mockUser]);

      const result = await service.findAll(5, 15);

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        take: 5,
        skip: 15,
        orderBy: { createdAt: 'desc' },
        select: userSelectFields,
      });
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return a user when found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOne(mockUser.id);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        select: userSelectFields,
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne('missing-id')).rejects.toThrow(
        new NotFoundException('User with id missing-id not found'),
      );
    });
  });

  describe('updateUser', () => {
    const baseUpdateDto: UpdateUserDto = {
      name: 'Updated Name',
      email: 'UPDATED@Example.com ',
      phone: ' +9876543210 ',
    };

    it('should update user without hashing password if password is not provided', async () => {
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateUser(mockUser.id, baseUpdateDto);

      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: {
          name: 'Updated Name',
          email: 'updated@example.com',
          phone: '+9876543210',
        },
        select: userSelectFields,
      });
      expect(result).toEqual(updatedUser);
    });

    it('should hash new password and update user when password is provided', async () => {
      const dtoWithPassword: UpdateUserDto = {
        ...baseUpdateDto,
        password: 'newSecretPassword',
      };
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      vi.mocked(bcrypt.hash).mockResolvedValue('newHashedPassword' as never);
      mockPrismaService.user.update.mockResolvedValue(mockUser);

      const result = await service.updateUser(mockUser.id, dtoWithPassword);

      expect(bcrypt.hash).toHaveBeenCalledWith('newSecretPassword', 10);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: {
          name: 'Updated Name',
          email: 'updated@example.com',
          phone: '+9876543210',
          passwordHash: 'newHashedPassword',
        },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user to update does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.updateUser('missing-id', baseUpdateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe('removeUser', () => {
    it('should delete and return the user', async () => {
      mockPrismaService.user.delete.mockResolvedValue(mockUser);

      const result = await service.removeUser(mockUser.id);

      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
      expect(result).toEqual(mockUser);
    });
  });
});