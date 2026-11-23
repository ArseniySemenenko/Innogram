import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty({ message: "Name cant be empty" })
    name!: string;

    @IsEmail({}, { message: "Wrong email format" })
    @IsNotEmpty()
    email!: string;

    @IsPhoneNumber(undefined, { message: "Wrong phone number" })
    @IsNotEmpty()
    phone!: string;

    @IsString()
    @MinLength(8, { message: "Password has to include more then 7" })
    @IsNotEmpty()
    password!: string;
}