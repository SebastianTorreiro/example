import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @ApiProperty({
    description: 'Cantidad de elementos por pagina.',
    example: 5,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  limit: number;

  @ApiProperty({
    description: 'Numero de pagina',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  offset: number;
}
