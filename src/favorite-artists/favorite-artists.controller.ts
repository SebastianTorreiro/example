import {
  Controller,
  Post,
  Param,
  Delete,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { FavoriteArtistsService } from './favorite-artists.service';
import { User } from '../schemas/user.schema';

@Controller('favorite-artists')
export class FavoriteArtistsController {
  constructor(private readonly favoriteService: FavoriteArtistsService) {}

  @Get(':id/favorite-artists')
  async getFavoriteArtists(@Param('id') userId: string): Promise<string[]> {
    try {
      const favoriteArtists = await this.favoriteService.getFavoriteArtists(
        userId,
      );
      if (!favoriteArtists) {
        throw new NotFoundException('Usuario no encontrado');
      }
      return favoriteArtists;
    } catch (error) {
      throw error;
    }
  }

  @Post(':userId/:artistId')
  async addToFavorites(
    @Param('userId') userId: string,
    @Param('artistId') artistId: string,
  ): Promise<any> {
    try {
      const user = await this.favoriteService.addToFavorites(userId, artistId);
      return { message: 'Artista agregado a favoritos', user };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Delete(':userId/:artistId')
  async removeFavoriteArtist(
    @Param('userId') userId: string,
    @Param('artistId') artistId: string,
  ): Promise<User> {
    return this.favoriteService.removeFavoriteArtist(userId, artistId);
  }
}
