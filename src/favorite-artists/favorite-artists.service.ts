import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
@Injectable()
export class FavoriteArtistsService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getFavoriteArtists(userId: string): Promise<string[]> {
    const user = await this.userModel
      .findById(userId)
      .populate('favoriteArtists')
      .exec();

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return user.favoriteArtists;
  }

  async addToFavorites(userId: string, artistId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    const artist = await this.userModel.findById(artistId);

    if (!user || !artist) {
      throw new Error('Usuario o artista no encontrado');
    }

    if (user.favoriteArtists.includes(artistId)) {
      throw new Error('El artista ya está en la lista de favoritos');
    }

    user.favoriteArtists.push(artistId);
    artist.favoriteArtists.push(userId); // Agregar el usuario a la lista de seguidores del artista

    await user.save();
    await artist.save();

    return user;
  }

  async removeFavoriteArtist(userId: string, artistId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    const artist = await this.userModel.findById(artistId);

    if (!user || !artist) {
      throw new Error('Usuario o artista no encontrado');
    }

    const index = user.favoriteArtists.indexOf(artistId);
    if (index > -1) {
      user.favoriteArtists.splice(index, 1);
    }

    const followerIndex = artist.favoriteArtists.indexOf(userId);
    if (followerIndex > -1) {
      artist.favoriteArtists.splice(followerIndex, 1);
    }

    await user.save();
    await artist.save();

    return user;
  }
}
