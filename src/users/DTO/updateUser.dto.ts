import { IsNotEmpty, IsOptional, IsNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator"
export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(20)
    @IsOptional()

    name?:string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0,{message:"my custome message"})
    @Max(20)
        @IsOptional()

    age?:number
}