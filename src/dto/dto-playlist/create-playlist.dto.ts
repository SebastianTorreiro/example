import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreatePlaylistDto {
  @ApiProperty({
    description: 'Lista de identificadores de canciones',
    example: ['611234567890123456789012', '611234567890123456789013'],
  })
  @IsString()
  @IsOptional()
  songs: ObjectId;

  @ApiProperty({
    description: 'Duración de la playlist en segundos',
    example: 1800,
  })
  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @ApiProperty({
    description: 'Lista de identificadores de canciones',
    example: ['611234567890123456789012', '611234567890123456789013'],
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Descripción de la playlist',
    example: 'Una playlist increíble con las mejores canciones',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'URL de la imagen de la playlist',
    example: 'https://ejemplo.com/imagen.png',
  })
  @IsString()
  image: string;

  @ApiProperty({
    description: 'Nombre del usuario creador de la playlist',
    example: 'john.doe',
  })
  @IsString()
  @IsNotEmpty()
  user: string;
}
