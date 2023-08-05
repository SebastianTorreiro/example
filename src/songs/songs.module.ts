import { Module } from '@nestjs/common';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Song, SongSchema } from 'src/schemas/song.schema';
import { ConfigModule } from '@nestjs/config';
import { UserController } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  providers: [SongsService, UserService],
  controllers: [SongsController, UserController],

  exports: [SongsService],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Song.name, schema: SongSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
})
export class SongsModule {}
