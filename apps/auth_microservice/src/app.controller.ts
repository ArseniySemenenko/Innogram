import { Controller, Get, ServiceUnavailableException} from '@nestjs/common';
import { AppService } from './app.service.js';
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { HealthEntity } from './users/entities/health.entity.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

    @Get("health")
    @ApiOperation({ summary: "Health Check" })
    @ApiOkResponse({ type: HealthEntity, description: "Service health" })
    @ApiInternalServerErrorResponse({description: "Service down"})
    async health() {
        if (!await this.appService.healthCheck()) throw new ServiceUnavailableException();
        return { status: "ok" };
    }
}
