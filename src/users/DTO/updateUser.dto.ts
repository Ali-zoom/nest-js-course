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
