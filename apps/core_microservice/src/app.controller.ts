import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

    @Get("health")
    async health() {
        if (!await this.appService.healthCheck()) throw new ServiceUnavailableException();
        return { status: "ok" };
    }
}
