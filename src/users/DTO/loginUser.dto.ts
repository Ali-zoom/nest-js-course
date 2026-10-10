import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class LoginUserDto {
     
    
        // @IsNumber()
        // @IsNotEmpty()
        // @Min(0,{message:"my custome message"})
        // @Max(20)
        // age:number
    
        
    
         @IsEmail()
        @IsNotEmpty()
        @MinLength(2)
        @MaxLength(200)
        email:string;
    
        @IsString()
        @IsNotEmpty()
        @MinLength(6)
        password:string;
}
