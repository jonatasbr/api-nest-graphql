import { InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

@InputType()
export class UpdateUserInput {
  @IsString()
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Caracteres inválidos' })
  name?: string;

  @IsOptional()
  @IsEmail()
  @IsNotEmpty({ message: 'E-mail inválido' })
  email?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Caracteres inválidos' })
  password?: string;
}
