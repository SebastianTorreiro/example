import { Module } from '@nestjs/common';
import { AuthJwtController } from './auth-jwt.controller';
import { AuthJwtService } from './auth-jwt.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { TokenService } from '../helpers/token_creator';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    ConfigModule, // Agrega el ConfigModule aquí
  ],
  controllers: [AuthJwtController],
  providers: [AuthJwtService, TokenService], // Asegúrate de agregar TokenService como un proveedor
})
export class AuthJwtModule {}
