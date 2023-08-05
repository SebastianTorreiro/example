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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { v2 as cloudinary } from 'cloudinary';
// import { diskStorage } from 'multer';
import { GetArtirtsFilterDto } from 'src/dto/get-artists-filter.dto';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { SongsService } from 'src/songs/songs.service';
import { UserService } from './user.service';
import { ImageType } from 'src/enums/enums';

@ApiTags('User')
@Controller('user')
export class UserController {
  private mercadopago: any;
  constructor(
    private readonly userService: UserService,
    private readonly songService: SongsService,
    private readonly configService: ConfigService,
  ) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('cloudinary.cloudName'),
      api_key: this.configService.get<string>('cloudinary.apiKey'),
      api_secret: this.configService.get<string>('cloudinary.apiSecret'),
    });
    this.mercadopago = require('mercadopago');
    this.mercadopago.configure({
      access_token: process.env.ACCESS_TOKEN,
    });
  }

  @ApiOperation({ summary: 'Obtener todos los usuarios.' })
  @Get()
  async getAll(@Res() res) {
    try {
      const users = await this.userService.getAll();
      return res.status(HttpStatus.OK).json(users);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal server error' });
    }
  }

  @ApiOperation({ summary: 'Agregar un follower al usuario.' })
  @ApiParam({ name: 'id', description: 'ID del user.' })
  @Post('/addfollower/:id')
  async addFollower(
    @Res() res,
    @Param('id') id: string,
    @Body('followerId') followerId: string,
  ) {
    try {
      const userClient = await this.userService.getById(id);
      const userArtist = await this.userService.getById(followerId);

      if (userClient.favoriteArtists.includes(followerId)) {
        return res
          .status(HttpStatus.OK)
          .json({ message: 'El follower ya lo sigue al usuario' });
      }

      if (userArtist.followers.includes(id)) {
        return res
          .status(HttpStatus.OK)
          .json({ message: 'El follower ya lo sigue al usuario' });
      }

      userClient.favoriteArtists.push(followerId);
      await this.userService.updateById(id, userClient);

      userArtist.followers.push(id);
      await this.userService.updateById(followerId, userArtist);

      return res
        .status(HttpStatus.OK)
        .json({ message: 'Se ha agregado un follower correctamente.' });
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.BAD_GATEWAY);
    }
  }

  @ApiOperation({ summary: 'Dejar de seguir al usuario.' })
  @ApiParam({ name: 'id', description: 'ID del user.' })
  @Post('/unfollow/:id')
  async unFollow(
    @Res() res,
    @Param('id') id: string,
    @Body('followerId') followerId: string,
  ) {
    try {
      const userClient = await this.userService.getById(id);
      const userArtist = await this.userService.getById(followerId);
      if (!userClient.favoriteArtists.includes(followerId)) {
        return res
          .status(HttpStatus.OK)
          .json({ message: 'El follower no lo sigue al usuario' });
      }
      const newFavoritesArtist = userClient.favoriteArtists.filter(
        (id) => id != followerId,
      );
      userClient.favoriteArtists = newFavoritesArtist;
      await this.userService.updateById(id, userClient);

      const newFollowers = userArtist.followers.filter((ids) => ids != id);
      userArtist.followers = newFollowers;
      await this.userService.updateById(followerId, userArtist);

      return res.status(HttpStatus.OK).json({ userClient, userArtist });
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.BAD_GATEWAY);
    }
  }

  @ApiOperation({ summary: 'Obtener musica comprada' })
  @ApiParam({ name: 'id', description: 'ID del user' })
  @Get('/mysongs/:id')
  async getMyMusic(
    @Param('id') id: string,
    @Query() pagination: PaginationQueryDto,
    @Query() { search }: GetArtirtsFilterDto,
    @Res() res,
  ) {
    try {
      const user = await this.userService.getById(id);
      const songsId = user.songsPurchased;
      let songs = await this.songService.findSongsByIds(songsId, pagination);
      if (search) {
        const searchLowerCase = search.toLowerCase();
        songs = songs.filter((song) =>
          song.name.toLowerCase().includes(searchLowerCase),
        );
      }
      return res.status(HttpStatus.OK).json({ songs });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: `Error en el servidor, error:${error}` });
    }
  }

  @ApiOperation({ summary: 'Obtener musica del artista' })
  @ApiParam({ name: 'id', description: 'ID del user' })
  @Get('/mysongsuploaded/:id')
  async getMyMusicUploaded(
    @Param('id') id: string,
    @Query() pagination: PaginationQueryDto,
    @Query() { search }: GetArtirtsFilterDto,
    @Res() res,
  ) {
    try {
      const user = await this.userService.getById(id);
      const songsId = user.songsUplodaded;
      let songs = await this.songService.findSongsByIds(songsId, pagination);
      if (search) {
        const searchLowerCase = search.toLowerCase();
        songs = songs.filter((song) =>
          song.name.toLowerCase().includes(searchLowerCase),
        );
      }
      return res.status(HttpStatus.OK).json({ songs });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: `Error en el servidor, error:${error}` });
    }
  }

  @ApiOperation({ summary: 'Busqueda de artistas y canciones' })
  @Get('/search')
  async getSearch(
    @Query() pagination: PaginationQueryDto,
    @Query() { search }: GetArtirtsFilterDto,
    @Res() res,
  ) {
    try {
      const users = await this.userService.getAllArtist(pagination);
      let songs = await this.songService.getAllSongs(pagination);
      let artistUsers = users.filter((user) => user.artist === true);
      if (search) {
        const searchLowerCase = search.toLowerCase();
        (artistUsers = artistUsers.filter((artist) =>
          artist.name.toLowerCase().includes(searchLowerCase),
        )),
          (songs = songs.filter((song) =>
            song.name.toLowerCase().includes(searchLowerCase),
          ));
      }
      return res.status(HttpStatus.OK).json({ ...songs, ...artistUsers });
    } catch (error) {
      console.log(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal server error' });
    }
  }

  @ApiOperation({ summary: 'Busqueda de artistas.' })
  @Get('/artists')
  async getArtists(
    @Query() pagination: PaginationQueryDto,
    @Query() { search }: GetArtirtsFilterDto,
    @Res() res,
  ) {
    try {
      const users = await this.userService.getAllArtist(pagination);
      let artistUsers = users.filter((user) => user.artist === true);
      if (search) {
        const searchLowerCase = search.toLowerCase();
        artistUsers = artistUsers.filter((artist) =>
          artist.name.toLowerCase().includes(searchLowerCase),
        );
      }
      return res.status(HttpStatus.OK).json({ ...artistUsers });
    } catch (error) {
      console.log(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal server error' });
    }
  }

  @ApiParam({ name: 'id', description: 'ID del user' })
  @ApiOperation({ summary: 'Obtener un usuario por su id' })
  @Get(':id')
  async getById(@Param('id') id: string, @Res() res) {
    try {
      const user = await this.userService.getById(id);
      if (!user) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'User not found' });
      }
      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal server error' });
    }
  }

  @ApiParam({ name: 'id', description: 'ID del user a eliminar' })
  @ApiOperation({ summary: 'Borrar un usuario por su id' })
  @Delete(':id')
  async deleteById(@Param('id') id: string, @Res() res) {
    try {
      const deletedUser = await this.userService.deleteById(id);
      if (!deletedUser) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'User not found' });
      }
      return res.status(HttpStatus.OK).json(deletedUser);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal server error' });
    }
  }

  @ApiParam({ name: 'id', description: 'ID del user a actualizar' })
  @ApiOperation({ summary: 'Actualizar un usuario por su id' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res,
  ) {
    try {
      const updatedUser = await this.userService.updateById(id, updateUserDto);
      if (!updatedUser) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'User not found' });
      }
      return res.status(HttpStatus.OK).json(updatedUser);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal server error' });
    }
  }

  @Post(':id/profile-photo')
  @UseInterceptors(
    // FileInterceptor('file', {
    //   storage: diskStorage({
    //     destination: './uploads', // Directorio de destino para guardar los archivos
    //     filename: (req, file, cb) => {
    //       const uniqueSuffix = `${Date.now()}-${Math.round(
    //         Math.random() * 1e9,
    //       )}`;
    //       cb(null, `${file.fieldname}-${uniqueSuffix}`);
    //     },
    //   }),
    // }),

    FileInterceptor('file'),
  )
  async uploadProfilePhoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Res() res,
  ) {
    try {
      const profilePhotoUrl = await this.songService.uploadFile(file);
      // const profilePhotoUrl = result.secure_url;
      console.log(profilePhotoUrl);
      const updatedUser = await this.userService.updateUserPhoto(
        id,
        profilePhotoUrl,
        ImageType.PROFILE,
      );

      if (!updatedUser) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'User not found' });
      }

      return res.status(HttpStatus.OK).json(updatedUser);
    } catch (error) {
      console.error(error);
      throw new Error('Error uploading profile photo');
    }
  }

  @Post('/addsong')
  async addSong(
    @Query('userid') userId: string,
    @Query('songid') songId: string,
    @Body() notificationData: any,
    @Res() res,
  ) {
    try {
      if (notificationData.type === 'payment') {
        const data = await this.mercadopago.payment.findById(
          notificationData.data.id,
        );
        console.log(data.response.status);
        if (data.response.status === 'approved') {
          const song = await this.songService.getById(songId);
          if (!song) {
            return res
              .status(HttpStatus.BAD_REQUEST)
              .json({ message: `La canción con id:${songId} no existe` });
          }
          const user = await this.userService.getById(userId);
          if (!user) {
            return res
              .status(HttpStatus.BAD_REQUEST)
              .json({ message: `El user con id:${userId} no existe` });
          }

          user.songsPurchased.push(song);
          const userUpdate = await this.userService.updateById(userId, user);

          return res.status(HttpStatus.OK).json({
            userUpdate,
            song,
            message: `La canción con id:${songId} ha sido agregada a las canciones del usuario.`,
          });
        }
      }
    } catch (error) {
      console.log(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'Ocurrió un error al procesar la solicitud.' });
    }
  }

  @Put('/coverPhoto/:id')
  @UseInterceptors(FileInterceptor('file'))
  async updatePort(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Res() res,
  ) {
    try {
      const coverPhotoUrl = await this.songService.uploadFile(file);

      const updatedUser = await this.userService.updateUserPhoto(
        id,
        coverPhotoUrl,
        ImageType.COVER,
      );

      console.log(updatedUser);

      if (!updatedUser) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'User not found' });
      }

      return res.status(HttpStatus.OK).json(updatedUser);
    } catch (error) {
      console.error(error);
      throw new Error('Error uploading profile photo');
    }
  }

  @Put('/description/:id')
  async updateDescription(
    @Body() updateUser: UpdateUserDto,
    @Param('id') id: string,
    @Res() res,
  ) {
    try {
      const updatedDescription = await this.userService.updateById(
        id,
        updateUser,
      );

      if (!updatedDescription) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'User not found' });
      }
      return res.status(HttpStatus.OK).json(updatedDescription);
    } catch (error) {
      console.error(error);
      throw new Error('Error uploading descrption: ' + error.message);
    }
  }
  @ApiParam({ name: 'userid', description: 'ID del user logueado' })
  @ApiParam({ name: 'artistid', description: 'ID del artista' })
  @ApiOperation({ summary: 'Ver si un usuario esta siguiendo a un artista' })
  @Get('/isfollowing/:userid/:artistid')
  async isFollowing(
    @Param('userid') userId: string,
    @Param('artistid') artistId: string,
    @Res() res,
  ) {
    const user = await this.userService.getById(userId);
    if (user.favoriteArtists.includes(artistId)) {
      return res.status(HttpStatus.OK).json({ isFollowing: true });
    } else {
      return res.status(HttpStatus.OK).json({ isFollowing: false });
    }
  }

  @ApiParam({ name: 'userid', description: 'ID del user logueado' })
  @ApiOperation({ summary: 'Consulta para todos los followers del artista' })
  @Get('/seguidores/:userid')
  async myFollowers(@Param('userid') userId: string, @Res() res) {
    try {
      const user = await this.userService.getById(userId);
      const followersId = user.followers;
      const followers = [];
      for (let i = 0; i < followersId.length; i++) {
        const follower = await this.userService.getById(followersId[i]);
        followers.push(follower);
      }
      return res.status(HttpStatus.OK).json(followers);
    } catch (error) {
      console.log(error);
      return res
        .status(HttpStatus.BAD_GATEWAY)
        .json({ message: 'Error en el servidor.' });
    }
  }

  @ApiParam({ name: 'userid', description: 'ID del user logueado' })
  @ApiOperation({ summary: 'Consulta para todos los followers del artista' })
  @Get('/favoritos/:userid')
  async myFavoritesArtists(@Param('userid') userId: string, @Res() res) {
    try {
      const user = await this.userService.getById(userId);
      const favoriteArtistsId = user.favoriteArtists;
      const favorites = [];
      for (let i = 0; i < favoriteArtistsId.length; i++) {
        const favorite = await this.userService.getById(favoriteArtistsId[i]);
        favorites.push(favorite);
      }
      return res.status(HttpStatus.OK).json(favorites);
    } catch (error) {
      console.log(error);
      return res
        .status(HttpStatus.BAD_GATEWAY)
        .json({ message: 'Error en el servidor.' });
    }
  }
}
