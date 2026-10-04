
import { IsNotEmpty, isNumber, IsNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator"
export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(20)

    name:string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0,{message:"my custome message"})
    @Max(20)
    age:number
}