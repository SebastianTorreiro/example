import { ApiProperty } from '@nestjs/swagger';

export class GetArtirtsFilterDto {
  @ApiProperty({
    description: 'Busqueda de cancion o artista',
    example: 'Came up',
    required: true,
  })
  search: string;
}
