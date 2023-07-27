import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  Matches,
  IsEmail,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Nombre del Usuario',
    example: 'Juan',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'faino',
  })
  @IsOptional()
  @IsString()
  surname?: string;

  @ApiProperty({
    description: 'Nombre de Usuario',
    example: 'Juan21',
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: 'Responde a si el usuario es artista o no',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  artist?: boolean;

  @ApiProperty({
    description: 'Genero del artista',
    example: true,
  })
  @IsOptional()
  genre?: string;

  @ApiProperty({
    description: 'Cantidad de seguidores',
  })
  @IsOptional()
  followers?: string[];

  @ApiProperty({
    description: 'Email del usuario',
    example: 'pedro@123.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;
  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'passwordD1!',
    required: true,
  })
  @IsOptional()
  @IsString()

  // @MinLength(8)
  // @Matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
  //   {
  //     message:
  //       'La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial.',
  //   },
  // )
  password?: string;

  @IsOptional()
  @IsBoolean()
  mercadopagoApproved?: boolean;

  @IsOptional()
  @IsBoolean()
  paypalApproved?: boolean;

  @IsOptional()
  @IsString()
  description?: string;
}
