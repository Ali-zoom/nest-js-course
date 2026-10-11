
import { IsEmail, IsEmpty, IsNotEmpty, isNumber, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator"
export class CreateProductrDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(20)
    name:string;

    // @IsNumber()
    // @IsNotEmpty()
    // @Min(0,{message:"my custome message"})
    // @Max(20)
    // age:number

    

         @IsString()
         @IsOptional()

    @MinLength(2)
    @MaxLength(200)
    description?:string;

    

     @IsNumber()
    @IsNotEmpty()
    @Min(0,{message:"my custome message"})
    @Max(20)
    price:number

    

  
}