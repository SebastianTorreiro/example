import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAlbumDto {
  @ApiProperty({
    description: 'Array con canciones de un album',
    example: ['611234567890123456789012', '611234567890123456789013'],
  })
  // @IsArray()
  @IsNotEmpty()
  canciones?: string[];
  @ApiProperty({
    description: 'Duración del album',
    example: 50,
  })
  @IsNumber()
  @IsNotEmpty()
  duracion: number;
  @ApiProperty({
    description: 'Nombre del album',
    example: 'Super terror',
  })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({
    description: 'Descripción del album',
    example: 'Album de rock progresivo',
  })
  @IsString()
  @IsNotEmpty()
  descripcion: string;
  @ApiProperty({
    description: 'Imagen del album',
    example: 'url',
  })
  @IsString()
  @IsOptional()
  imagen?: string;
  @ApiProperty({
    description: 'Precio del album',
    example: 20,
  })
  @IsNumber()
  @IsNotEmpty()
  precio: number;
  @ApiProperty({
    description: 'Id del usuario',
    example: '611234567890123456789012',
  })
  @IsString()
  @IsNotEmpty()
  usuario: string;
}
