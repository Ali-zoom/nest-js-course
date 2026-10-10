<<<<<<< HEAD
import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(6, { message: 'my custome message' })
  @IsOptional()
  password?: string;
}
=======
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
>>>>>>> 47a567bc117c759e3298386dea82475883322a25
