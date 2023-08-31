import { IsEmail, IsNotEmpty, Length } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @Length(6, 18)
  password: string;
}

export class CreateUsernameDto {
  @IsNotEmpty()
  @Length(6, 18)
  username: string;
  @IsNotEmpty()
  password: string;
}
export interface ICreateUsername {
  username: string;
  password: string;
}
