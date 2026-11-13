import { Test } from '@nestjs/testing';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { ServiceUnavailableException } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

describe('AppController', () => {
  let controller: AppController;
  let appService: AppService;

  // Мокаем сервис
  const mockAppService = {
    healthCheck: vi.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    controller = moduleRef.get<AppController>(AppController);
    appService = moduleRef.get<AppService>(AppService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('health', () => {
    it('should return status ok when healthCheck resolves to true', async () => {
      mockAppService.healthCheck.mockResolvedValue(true);

      const result = await controller.health();

      expect(result).toEqual({ status: "ok" });
      expect(appService.healthCheck).toHaveBeenCalledTimes(1);
    });

    it('should throw ServiceUnavailableException when healthCheck resolves to false', async () => {
      mockAppService.healthCheck.mockResolvedValue(false);

      // Контроллер выбрасывает исключение, а не возвращает объект
      await expect(controller.health()).rejects.toThrow(ServiceUnavailableException);
      expect(appService.healthCheck).toHaveBeenCalledTimes(1);
    });

    it('should propagate the error when healthCheck rejects', async () => {
      mockAppService.healthCheck.mockRejectedValue(new Error('DB down'));

      await expect(controller.health()).rejects.toThrow('DB down');
      expect(appService.healthCheck).toHaveBeenCalledTimes(1);
    });
  });
});