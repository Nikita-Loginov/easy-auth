import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Почта для входа',
    example: 'admin@gmail.com',
    minLength: 1,
    required: true,
    format: 'email',
  })
  @IsString({ message: 'Почта должна быть строчкой' })
  @IsNotEmpty({ message: 'Почта должна иметь как минимум один символ' })
  @IsEmail({}, { message: 'Введите корректный email' })
  email: string;

  @ApiProperty({
    description: 'Пароль для входа',
    example: '123456a',
    minLength: 6,
    required: true,
  })
  @IsString({ message: 'Пароль должен быть строчкой' })
  @MinLength(6, { message: 'Пароль должен иметь как минимум 6 символов' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'Пароль должен содержать хотя бы одну букву и одну цифру',
  })
  password: string;
}
