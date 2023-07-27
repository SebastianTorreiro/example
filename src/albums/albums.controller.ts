import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateAlbumDto } from 'src/dto/create-album.dto';
import { UpdateAlbumDto } from 'src/dto/update-album.dto';
import { SongsService } from 'src/songs/songs.service';
import { UserService } from 'src/user/user.service';
import { AlbumsService } from './albums.service';

@ApiTags('Albums')
@Controller('albums')
export class AlbumsController {
  constructor(
    private albumService: AlbumsService,
    private songService: SongsService,
    private userService: UserService,
  ) {}

  @ApiOperation({ summary: 'Obtener todas los albumes' })
  @Get()
  async findAll(@Res() res) {
    try {
      const albums = await this.albumService.findAll();
      if (!albums) {
        return res
          .sendStatus(HttpStatus.NOT_FOUND)
          .json({ message: 'No se ha encontrado ningun album' });
      }
      return res.status(HttpStatus.OK).json(albums);
    } catch (error) {
      return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @ApiParam({ name: 'nombre', description: 'nombre del album' })
  @ApiOperation({ summary: 'Obtener una canción por su nombre' })
  @Get(':nombre')
  async findOne(@Param('nombre') nombre: string, @Res() res) {
    try {
      const albums = await this.albumService.findByName(nombre);
      if (!albums) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'No se ha encontrado ningún álbum con ese nombre',
        });
      }
      return res.status(HttpStatus.OK).json(albums);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @ApiParam({ name: 'id', description: 'ID del artista' })
  @ApiOperation({ summary: 'Obtener albunes de un artista por su id' })
  @Get('byArtist/:id')
  async findByArtist(@Param('id') id: string, @Res() res) {
    try {
      const albums = await this.albumService.findByArtist(id);
      if (!albums) {
        return res.sendStatus(HttpStatus.NOT_FOUND).json({
          message: 'No se han encontrado albumes a nombre de este artista',
        });
      }
      res.status(HttpStatus.OK).json(albums);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @ApiOperation({ summary: 'Crear un album' })
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() body: CreateAlbumDto,
    @Res() res,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(body.canciones);

    try {
      const { canciones, duracion, nombre, descripcion, usuario, precio } =
        body;

      const userForUpdates = await this.userService.getById(usuario);

      if (!userForUpdates) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'User not found' });
      }

      const albumPhotoUrl = await this.songService.uploadFile(file);

      const album = await this.albumService.create({
        canciones,
        duracion,
        nombre,
        descripcion,
        usuario,
        precio,
        imagen: albumPhotoUrl,
      });
      if (!album) {
        return res.sendStatus(HttpStatus.BAD_REQUEST);
      }

      userForUpdates.albumes.push(album);

      const userUpdated = await this.userService.updateById(
        usuario,
        userForUpdates,
      );

      return res.status(HttpStatus.OK).json(userUpdated);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @ApiParam({ name: 'id', description: 'ID del album' })
  @ApiOperation({ summary: 'Actualizar el album por id' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateAlbumDto,
    @Res() res,
  ) {
    try {
      const album = await this.albumService.update(id, body);
      if (!album) {
        return res.sendStatus(HttpStatus.NOT_FOUND);
      }
      return res.status(HttpStatus.OK).json(album);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @ApiParam({ name: 'id', description: 'ID del album' })
  @ApiOperation({ summary: 'Borrar el album por id' })
  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res) {
    try {
      const album = await this.albumService.delete(id);
      if (!album) {
        return res.sendStatus(HttpStatus.NOT_FOUND);
      }
      return res.status(HttpStatus.NO_CONTENT);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}
