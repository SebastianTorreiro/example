import { IsOptional, IsString } from 'class-validator';

export class PaymentStatus {
  @IsOptional()
  @IsString()
  paypalApproved?: string;

  @IsOptional()
  @IsString()
  mercadopagoApproved?: string;
}
