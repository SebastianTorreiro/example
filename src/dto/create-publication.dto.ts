import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePublicationDto {
  @ApiProperty({
    description: 'Id del usuario de la publicacion',
    example: '156498216',
    required: true,
  })
  @IsString()
  user: string;
  @ApiProperty({
    description: 'Contenido de la publicacion',
    required: true,
  })
  @IsString()
  content: string;
  @ApiProperty({
    description: 'Song de la publicacion',
  })
  @IsString()
  song: string;
}
