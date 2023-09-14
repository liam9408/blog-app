import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { DTO_VALIDATOR } from '../../constants';

// Register User Data Transfer Object
export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  public firstName: string;

  @IsString()
  @IsNotEmpty()
  public lastName: string;

  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(DTO_VALIDATOR.PASSWORD_REGEX, {
    message: DTO_VALIDATOR.PASSWORD_VALIDATOR_MESSAGE,
  })
  public password: string;
}

export default RegisterUserDto;
