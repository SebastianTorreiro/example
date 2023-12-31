import { Module } from '@nestjs/common';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Album, AlbumSchema } from '../schemas/album.schema';
import { ConfigModule } from '@nestjs/config';
import { User, UserSchema } from '../schemas/user.schema';
import { SongsService } from '../songs/songs.service';
import { Song, SongSchema } from '../schemas/song.schema';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Album.name,
        schema: AlbumSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Song.name,
        schema: SongSchema,
      },
    ]),
    ConfigModule,
  ],

  controllers: [AlbumsController],
  providers: [AlbumsService, SongsService, UserService],
})
export class AlbumsModule {}
