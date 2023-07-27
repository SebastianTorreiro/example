import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAlbumDto {
  @ApiProperty({
    description: 'Array de canciones del album',
    example: ['611234567890123456789012', '611234567890123456789013'],
  })
  @IsOptional()
  @IsArray()
  canciones: string[];
  @ApiProperty({
    description: 'Duración del album',
    example: 52,
  })
  @IsOptional()
  @IsNumber()
  duracion: number;
  @ApiProperty({
    description: 'Nombre del album',
    example: 'SOUR',
  })
  @IsOptional()
  @IsString()
  nombre: string;
  @ApiProperty({
    description: 'Nombre del artista',
    example: 'SOUR',
  })
  @IsOptional()
  @IsString()
  nombreArtista: string;
  @ApiProperty({
    description: 'Descripción del album',
    example: 'album de rock progresivo',
  })
  @IsOptional()
  @IsString()
  descripcion: string;
  @ApiProperty({
    description: 'Imagen del album',
  })
  @IsOptional()
  @IsString()
  imagen: string;
  @ApiProperty({
    description: 'Precio del album',
    example: 25,
  })
  @IsOptional()
  @IsNumber()
  precio: number;
  @ApiProperty({
    description: 'Usuario creador del album',
    example: '611234567890123456789013',
  })
  @IsOptional()
  @IsString()
  usuario: string;
}
