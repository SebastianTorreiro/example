import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAlbumDto } from 'src/dto/create-album.dto';
import { UpdateAlbumDto } from 'src/dto/update-album.dto';
import { Album } from 'src/schemas/album.schema';

@Injectable()
export class AlbumsService {
  constructor(@InjectModel(Album.name) private albumModel: Model<Album>) {}

  async create(createAlbum: CreateAlbumDto) {
    const newAlbum = new this.albumModel(createAlbum);
    await newAlbum.save();
    return newAlbum;
  }

  async update(id: string, updateAlbum: UpdateAlbumDto) {
    return await this.albumModel.findByIdAndUpdate(id, updateAlbum);
  }

  async findAll() {
    return this.albumModel.find().populate({ path: 'usuario', model: 'User' });
  }

  async delete(id: string) {
    return await this.albumModel.findByIdAndDelete(id);
  }

  async findByName(nombre: string) {
    return await this.albumModel
      .findOne({ nombre })
      .populate({ path: 'usuario', model: 'User' })
      .populate({ path: 'canciones', model: 'Song' });
  }

  async findByArtist(id: string) {
    return this.albumModel
      .findOne({ usuario: id })
      .populate({ path: 'usuario', model: 'User' })
      .populate({ path: 'canciones', model: 'Song' });
    // .populate({ path: 'usuario', model: 'User' })
  }

  async findById(id: string) {
    return this.albumModel
      .findById(id)
      .populate({ path: 'usuario', model: 'User' })
      .populate({ path: 'canciones', model: 'Song' });
  }
}
