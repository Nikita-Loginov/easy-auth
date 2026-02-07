import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString({ message: 'Имя должно быть строчкой' })
  @IsNotEmpty({ message: 'Имя должно иметь как минимум 1 символ' })
  name: string;

  @IsString({ message: 'Почта должна быть строчкой' })
  @IsNotEmpty({ message: 'Почта должна иметь как минимум один символ' })
  @IsEmail({}, { message: 'Введите корректный email' })
  email: string;

  @IsString({ message: 'Пароль должен быть строчкой' })
  @MinLength(6, { message: 'Пароль должен иметь как минимум 6 символов' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'Пароль должен содержать хотя бы одну букву и одну цифру',
  })
  password: string;
}
