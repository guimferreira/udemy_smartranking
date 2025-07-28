import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreatePlayerDto {
    @IsNotEmpty()
    @IsString()
    readonly phoneNumber: string;
    
    @IsString()
    @IsEmail()
    readonly email: string;
    
    @IsString()
    @IsNotEmpty()
    readonly name: string;
}