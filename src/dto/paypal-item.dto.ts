import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AmountDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  currency_code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  value: string;
}

export class paypalItemDto {
  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => AmountDto)
  amount: AmountDto;
}
