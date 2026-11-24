import { ApiProperty } from "@nestjs/swagger";

export class UserEntity{
    @ApiProperty({
        example: "cmwtuf3mw000001nzxoq44kkl",
        description: "Uniq user id"
    })
    id!: string;

    @ApiProperty({
        example: "John Patced 2 Shelby",
        description: "User name"
    })
    name!: string;

    @ApiProperty({
        example: "shelby567@gmail.com",
        description: "User email"
    })
    email!: string;


    @ApiProperty({
        example: "+375259217470",
        description: "User phone number"
    })
    phone!: string;

    @ApiProperty({
        example: '2026-11-23T22:34:17.000Z',
        description: 'Created at Date',
      })
      createdAt!: Date;
    
      @ApiProperty({
        example: '2026-11-23T22:41:15.013Z',
        description: 'Updated at Date',
      })
      updatedAt!: Date;
}