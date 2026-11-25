import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MinLength } from "class-validator";

export class UpdateUserDto{
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
    @IsOptional()
    @MinLength(8, { message: "Password has to include more then 7" })
    password?: string;
}