import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateSongDto {
  @ApiProperty({
    description: 'Nombre de la canción',
    example: 'Wont fall',
  })
  @IsOptional()
  @IsString()
  name?: string;
  @ApiProperty({
    description: 'Duracion de la canción en segundos',
    example: 180,
  })
  @IsOptional()
  @IsNumber()
  duration?: number;
  @ApiProperty({
    description: 'Id del usuario creador de la canción',
    example: '611234567890123456789012',
    required: false,
  })
  @IsOptional()
  @IsString()
  user?: string;
  @ApiProperty({
    description: 'Nombre del coArtista de la canción',
    example: 'Post Malone',
  })
  @IsOptional()
  @IsString()
  coArtist?: string;
  @ApiProperty({
    description: 'Precio de la canción',
    example: 35,
  })
  @IsOptional()
  @IsNumber()
  price?: number;
  @ApiProperty({
    description: 'Genero de la canción',
    example: 'Rock',
  })
  @IsOptional()
  @IsString()
  genre?: string;
  @ApiProperty({
    description: 'Imagen de la canción',
  })
  @IsOptional()
  @IsString()
  image?: string;
  @ApiProperty({
    description: 'Fecha de creacion de la canción',
    example: '30/03/2003',
  })
  @IsOptional()
  @IsString()
  date?: Date;
  @ApiProperty({
    description: 'Album de la canción',
    example: 'Random access memories',
  })
  @IsOptional()
  @IsString()
  album?: string;
}
