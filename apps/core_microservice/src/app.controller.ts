import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

    @Get("health")
    async health() {
        if (await this.appService.healthCheck()) {
            return { status: 200 };
        }
        else return { status: 500 };
  }
}
