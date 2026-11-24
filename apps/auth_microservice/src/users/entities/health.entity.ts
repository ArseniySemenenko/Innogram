import { ApiProperty } from "@nestjs/swagger";

export class HealthEntity{
    @ApiProperty({
        example: "ok",
        description: "Health status"
    })
    status!: string;
}