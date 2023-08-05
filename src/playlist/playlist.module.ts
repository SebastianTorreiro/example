import { Module } from '@nestjs/common';
import { PlaylistController } from './controllers/playlist.controller';
import { PlaylistService } from './playlist.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PlaylistSchema, Playlist } from 'src/schemas/playlist.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SongsService } from 'src/songs/songs.service';
import { Song, SongSchema } from 'src/schemas/song.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Playlist.name,
        schema: PlaylistSchema,
      },
      {
        name: Song.name,
        schema: SongSchema,
      },
    ]),
    ConfigModule, // Agrega el ConfigModule aquí
  ],
  controllers: [PlaylistController],
  providers: [PlaylistService, SongsService, ConfigService],
})
export class PlaylistModule {}
