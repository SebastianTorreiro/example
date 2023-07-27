import { Module } from '@nestjs/common';
import { MercadopagoService } from './mercadopago.service';
import { ConfigModule } from '@nestjs/config';
import { UserController } from 'src/user/user.controller';
import { SongsController } from 'src/songs/songs.controller';
import { UserService } from 'src/user/user.service';
import { SongsService } from 'src/songs/songs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Song, SongSchema } from 'src/schemas/song.schema';
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
