import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class RegisterInput {
  @Field((type) => String)
  @IsString({ message: 'Имя должно быть строчкой' })
  @IsNotEmpty({ message: 'Имя должно иметь как минимум 1 символ' })
  @MaxLength(50, { message: 'Имя не должно превышать 50 символов' })
  name: string;

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
