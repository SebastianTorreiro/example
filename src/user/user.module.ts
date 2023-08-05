import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { SongsService } from 'src/songs/songs.service';
import { Song, SongSchema } from 'src/schemas/song.schema';
import { SongsController } from 'src/songs/songs.controller';

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
  controllers: [UserController, SongsController],
  providers: [UserService, SongsService],
  exports: [UserService],
})
export class UserModule {}
