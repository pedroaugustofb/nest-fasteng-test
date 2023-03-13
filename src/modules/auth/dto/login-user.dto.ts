import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { User } from '../../users/schemas';

export class InputLoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    required: true,
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  password: string;
}

export class OutputLoginUserDto {
  success: boolean;
  token: string;
  user: User;
  email: string;
  name: string;
  planName: string;
}
