import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString } from 'class-validator';

export class UpdatePlaylistDto {
  @ApiProperty({
    description: 'Lista de identificadores de canciones',
    example: ['611234567890123456789012', '611234567890123456789013'],
    required: false,
  })
  @IsString()
  songs?: string;

  @ApiProperty({
    description: 'Duración de la playlist en segundos',
    example: 1800,
    required: false,
  })
  @IsNumber()
  duration?: number;

  @ApiProperty({
    description: 'Nombre de la playlist',
    example: 'Mi Playlist',
    required: false,
  })
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Descripción de la playlist',
    example: 'Una playlist increíble con las mejores canciones',
    required: false,
  })
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Descripción de la playlist',
    example: 'Una playlist increíble con las mejores canciones',
    required: false,
  })
  @IsString()
  image?: string;

  @ApiProperty({
    description: 'Fecha de creación de la playlist',
    example: '2023-07-10T12:34:56.789Z',
    required: false,
  })
  @IsDateString()
  creationDate?: Date;
}
