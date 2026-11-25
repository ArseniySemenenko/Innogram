import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty({example: "Tomas Shelby" , description: "User name"})
    @IsString()
    @IsNotEmpty({ message: "Name cant be empty" })
    name!: string;

    @ApiProperty({example: "shelby123@mail.com" , description: "User email"})
    @IsEmail({}, { message: "Wrong email format" })
    @IsNotEmpty()
    email!: string;

    @ApiProperty({example: "+375259217460" , description: "User phone number"})
    @IsPhoneNumber(undefined, { message: "Wrong phone number" })
    @IsNotEmpty()
    phone!: string;

    @ApiProperty({example: "12345678" , description: "User password" , minLength: 8})
    @IsString()
    @MinLength(8, { message: "Password has to include more then 7" })
    @IsNotEmpty()
    password!: string;
}