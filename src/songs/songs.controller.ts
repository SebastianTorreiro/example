import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateSongDto } from 'src/dto/create-song.dto';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { UserService } from 'src/user/user.service';

import { SongsService } from './songs.service';

@ApiTags('Songs')
@Controller('songs')
export class SongsController {
  constructor(
    private songsService: SongsService,
    private userService: UserService,
  ) {}

  @ApiOperation({ summary: 'Obtener todas las canciones' })
  @Get()
  async getAllSongs(@Query() pagination: PaginationQueryDto, @Res() res) {
    try {
      const songs = await this.songsService.getAllSongs(pagination);
      return res.status(HttpStatus.OK).json(songs);
    } catch (err) {
      return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiParam({ name: 'id', description: 'ID de la canción' })
  @ApiOperation({ summary: 'Obtener una canción por su id' })
  @Get(':id')
  async getById(@Param('id') id: string, @Res() res) {
    try {
      const song = await this.songsService.getById(id);
      if (!song) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Song not found' });
      }
      return res.status(HttpStatus.OK).json(song);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal server error' });
    }
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'song', maxCount: 1 },
      { name: 'image', maxCount: 1 },
    ]),
  )
  @ApiOperation({ summary: 'Crear una nueva canción.' })
  @Post('/create')
  async createSong(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createSongDto: CreateSongDto,
    @Res() res,
  ) {
    try {
      console.log(files);

      const filePromises = Object.values(files).map(async (fileArray) => {
        if (Array.isArray(fileArray) && fileArray.length > 0) {
          const file = fileArray[0];
          return await this.songsService.uploadFile(file);
        }
        return null;
      });

      const fileUrls = await Promise.all(filePromises);

      function getFileType(link: string): string {
        const extension: string = link.split('.').pop();
        return extension.toLowerCase();
      }

      function separateLinks(links: string[]): {
        songLink: string | null;
        imageLink: string | null;
      } {
        const result = {
          songLink: null,
          imageLink: null,
        };

        for (const link of links) {
          const fileType = getFileType(link);
          if (fileType === 'mp3' || fileType === 'mp4') {
            result.songLink = link;
          } else if (
            fileType === 'jpg' ||
            fileType === 'jpeg' ||
            fileType === 'png'
          ) {
            result.imageLink = link;
          }
        }

        return result;
      }

      const { songLink, imageLink } = separateLinks(fileUrls);

      console.log('arreglos de imagenes', fileUrls);
      const { name, duration, user, coArtist, price, genre, date, album } =
        createSongDto;

      const song = await this.songsService.createSong({
        name,
        duration,
        user,
        coArtist,
        price,
        genre,
        image: imageLink,
        date,
        src: songLink,
        album,
      });

      const usuario = await this.userService.getById(user);
      usuario.songsUplodaded.push(song._id);
      await this.userService.updateById(user, usuario);
      return res.status(HttpStatus.OK).json({ song });
    } catch (err) {
      console.log(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
  }

  @ApiParam({ name: 'id', description: 'ID de la canción a actualizar' })
  @ApiOperation({ summary: 'Actualizar una canción por su id' })
  @Put(':id')
  async updateSong(
    @Param('id') id: number,
    @Body() body: any,
    @Res() res: any,
  ) {
    try {
      const song = await this.songsService.updateSong(id, body);
      return res.status(HttpStatus.OK).json({ song });
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
    }
  }

  @ApiParam({ name: 'id', description: 'ID de la canción a eliminar' })
  @ApiOperation({ summary: 'Borrar una canción por su id' })
  @Delete(':id')
  async deleteSong(@Param('id') id: number, @Res() res: any) {
    try {
      await this.songsService.deleteSong(id);
      return res
        .status(HttpStatus.OK)
        .json(`La cancion con ${id} ha sido eliminada`);
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
    }
  }
}
