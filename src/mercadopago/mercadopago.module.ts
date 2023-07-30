import { Module } from '@nestjs/common';
import { MercadopagoService } from './mercadopago.service';
import { ConfigModule } from '@nestjs/config';
import { UserController } from '../user/user.controller';
import { SongsController } from '../songs/songs.controller';
import { UserService } from '../user/user.service';
import { SongsService } from '../songs/songs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { Song, SongSchema } from '../schemas/song.schema';
import { MercadopagoController } from './mercadopago.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Song.name,
        schema: SongSchema,
      },
    ]),
    ConfigModule, // Agrega el ConfigModule aquí
  ],
  controllers: [UserController, SongsController, MercadopagoController],
  providers: [MercadopagoService, UserService, SongsService],
  exports: [MercadopagoService],
})
export class MercadopagoModule {}
