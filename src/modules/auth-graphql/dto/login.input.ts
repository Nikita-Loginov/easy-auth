import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

@InputType()
export class LoginInput {
  @Field((type) => String)
  @IsString({ message: 'Почта должна быть строчкой' })
  @IsNotEmpty({ message: 'Почта должна иметь как минимум один символ' })
  @IsEmail({}, { message: 'Введите корректный email' })
  email: string;

  @Field((type) => String)
  @IsString({ message: 'Пароль должен быть строчкой' })
  @MinLength(6, { message: 'Пароль должен иметь как минимум 6 символов' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'Пароль должен содержать хотя бы одну букву и одну цифру',
  })
  password: string;
}
