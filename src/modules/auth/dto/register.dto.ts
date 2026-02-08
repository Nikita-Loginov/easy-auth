import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Имя для регистрации',
    example: 'admin',
    minLength: 1,
    maxLength: 50,
    required: true,
  })
  @IsString({ message: 'Имя должно быть строчкой' })
  @IsNotEmpty({ message: 'Имя должно иметь как минимум 1 символ' })
  @MaxLength(50, { message: 'Имя не должно превышать 50 символов' })
  name: string;

  @ApiProperty({
    description: 'Почта для регистрации',
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
    description: 'Пароль для регистрации',
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
