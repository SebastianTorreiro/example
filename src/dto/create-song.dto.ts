import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateSongDto {
  @ApiProperty({
    description: 'Nombre de la canción',
    example: 'Came up',
    required: true,
  })
  @IsString()
  name: string;
  @ApiProperty({
    description: 'Duracion de la canción en segundos',
    example: 180,
    required: true,
  })
  @IsNumber()
  duration: number;
  @ApiProperty({
    description: 'Id del usuario creador de la canción',
    example: '611234567890123456789012',
    required: true,
  })
  @IsString()
  user: string;
  @ApiProperty({
    description: 'Nombre del coArtista de la canción',
    example: 'Post Malone',
    required: false,
  })
  @IsOptional()
  @IsString()
  coArtist: string;
  @ApiProperty({
    description: 'Precio de la canción',
    example: 5,
    required: true,
  })
  @IsNumber()
  price: number;
  @ApiProperty({
    description: 'Genero de la canción',
    example: 'ROck',
    required: false,
  })
  @IsString()
  genre: string;
  @ApiProperty({
    description: 'Imagen de la canción',
    required: false,
  })
  @IsOptional()
  @IsString()
  image: string;
  @ApiProperty({
    description: 'Fecha de lanzamiento',
    example: '5/10/2023',
    required: false,
  })
  @IsString()
  date: string;
  @ApiProperty({
    description: 'Nombre del album al que pertenece',
    example: 'lowlife',
    required: false,
  })
  @IsOptional()
  @IsString()
  album: string;

  src: string;
}
