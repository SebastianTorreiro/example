import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { v2 as cloudinary } from 'cloudinary';
import { Model, ObjectId } from 'mongoose';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { CreatePlaylistDto } from 'src/dto/dto-playlist/create-playlist.dto';
import { UpdatePlaylistDto } from 'src/dto/dto-playlist/update-playlist.dto';
import { Playlist, PlaylistDocument } from 'src/schemas/playlist.schema';
import { SongsService } from 'src/songs/songs.service';
import { PlaylistService } from '../playlist.service';

@ApiTags('Playlist')
@Controller('playlist')
export class PlaylistController {
  constructor(
    @InjectModel(Playlist.name) private playlistModel: Model<Playlist>,
    private playlistService: PlaylistService,
    private songService: SongsService,
    private readonly configService: ConfigService,
  ) {
    // cloudinary.config({
    //   cloud_name: configService.get('CLOUDINARY_CLOUD_NAME'),
    //   api_key: configService.get('CLOUDINARY_API_KEY'),
    //   api_secret: configService.get('CLOUDINARY_API_SECRET-mpATPo'),
    // // });

    cloudinary.config({
      cloud_name: 'dlvpftdsm',
      api_key: '359667715474286',
      api_secret: '9tNuIOwxI1MNhiMlpEu8-mpATPo',
    });
  }

  @ApiOperation({ summary: 'Obtener todas las playlists' })
  @Get()
  findAllPlaylist() {
    return this.playlistService.findAllPlaylist();
  }

  @ApiOperation({ summary: 'Obtener una playlist por su ID' })
  @ApiParam({ name: 'id', description: 'ID de la playlist' })
  @Get(':id')
  async findOnePlaylist(@Param('id') id: string) {
    const playlist = this.playlistService.findOnePlaylist(id);
    if (!playlist) throw new NotFoundException('Playlist does not exist');
    return playlist;
  }

  @ApiOperation({ summary: 'Crear una nueva playlist' })
  @ApiBody({ type: CreatePlaylistDto })
  @Post()
  async createPlaylist(@Body() body: CreatePlaylistDto) {
    try {
      return await this.playlistService.createPlaylist(body);
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Playlist already exist');
      }
      throw error;
    }
  }

  @ApiOperation({ summary: 'Eliminar una playlist por su ID' })
  @ApiParam({ name: 'id', description: 'ID de la playlist' })
  @Delete(':id')
  deletePlaylist(@Param('id') id: string) {
    const playlist = this.playlistService.deletePlaylist(id);
    if (!playlist) throw new NotFoundException('Playlist does not exist');
  }

  @ApiOperation({ summary: 'Actualizar una playlist' })
  @ApiParam({ name: 'id', description: 'ID de la playlist' })
  @ApiBody({ type: UpdatePlaylistDto })
  @Put(':id')
  async updatePlaylist(
    @Param('id') id: string,
    @Body() body: UpdatePlaylistDto,
  ) {
    const playlist = await this.playlistService.updatePlaylist(id, body);
    if (!playlist) throw new NotFoundException('Playlist does not exist!');
    return playlist;
  }

  @ApiOperation({ summary: 'Agregar una canción a una playlist' })
  @ApiParam({ name: 'id', description: 'ID de la playlist' })
  @ApiBody({ type: String })
  @Put('/songadd/:id')
  async addSongToPlaylist(@Param('id') id: string, @Body() body) {
    const playlist: PlaylistDocument = await this.playlistModel.findOne({
      _id: id,
    });
    if (!playlist) throw new NotFoundException('Playlist Not Found');
    const songId: ObjectId = body.songId;
    const playlistCheck: boolean = playlist.songs.includes(songId);
    if (playlistCheck)
      throw new ConflictException('The song is already in the playlist');
    playlist.songs.push(songId);
    await playlist.save();
    return playlist;
  }

  @ApiOperation({ summary: 'Eliminar una canción de una playlist' })
  @ApiParam({ name: 'id', description: 'ID de la playlist' })
  @ApiBody({ type: String })
  @Put('/songdel/:id')
  async deleteSongFromPlaylist(@Param('id') id: ObjectId, @Body() body: any) {
    const playlist: PlaylistDocument | null = await this.playlistModel.findOne({
      _id: id,
    });
    if (!playlist) throw new NotFoundException('Playlist Not Found');
    const songId: ObjectId = body.songId;
    const playlistCheck: boolean = playlist.songs.includes(songId);
    if (!playlistCheck)
      throw new ConflictException('The song is not in the playlist');

    const indexToRemove = playlist.songs.findIndex(
      (song: ObjectId) => song === songId,
    );
    playlist.songs.splice(indexToRemove, 1);
    await playlist.save();

    return playlist;
  }

  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: new CloudinaryStorage({
  //       cloudinary: cloudinary,
  //     }),
  //   }),
  // )

  @UseInterceptors(FileInterceptor('file'))
  @Post('file')
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    const fileUrl = await this.playlistService.uploadFile(file);
    console.log(fileUrl);
    return fileUrl;
  }

  // @Delete('')
  // async deleteDatabase() {
  //   await this.playlistModel.deleteMany();
  // }
}
