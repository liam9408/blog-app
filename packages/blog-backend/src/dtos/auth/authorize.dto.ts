import { IsString, IsEmail, IsOptional } from 'class-validator';

// Authorize User Data Transfer Object
export class AuthorizeUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}

export default AuthorizeUserDto;
