import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlaylistDto } from 'src/dto/dto-playlist/create-playlist.dto';
import { UpdatePlaylistDto } from 'src/dto/dto-playlist/update-playlist.dto';
import { Playlist, PlaylistDocument } from 'src/schemas/playlist.schema';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectModel(Playlist.name) private playlistModel: Model<Playlist>,
  ) {}

  async findAllPlaylist(): Promise<Playlist[]> {
    return this.playlistModel.find().populate({ path: 'songs', model: 'Song' });
  }

  async createPlaylist(
    createPlaylist: CreatePlaylistDto,
  ): Promise<PlaylistDocument> {
    const newPlaylist: PlaylistDocument = await this.playlistModel.create(
      createPlaylist,
    );
    return newPlaylist;
  }

  async findOnePlaylist(id: string): Promise<PlaylistDocument> {
    return await this.playlistModel
      .findById(id)
      .populate({ path: 'songs', model: 'Song' })
      .exec();
  }

  async deletePlaylist(id: string): Promise<PlaylistDocument> {
    return this.playlistModel.findByIdAndDelete(id);
  }

  async updatePlaylist(
    id: string,
    updatePlaylistDto: UpdatePlaylistDto,
  ): Promise<Playlist> {
    return this.playlistModel
      .findByIdAndUpdate(id, updatePlaylistDto, {
        new: true,
      })
      .populate({ path: 'songs', model: 'Song' });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    // try {
    //   console.log('result')
    //   console.log(file)
    //   const result = await cloudinary.uploader.upload(file.path);
    //   console.log(result)
    //   // Aquí puedes realizar acciones adicionales, como guardar la URL en la base de datos
    //   return result.secure_url; // Retorna la URL del archivo subido
    // } catch (error) {
    //   // Maneja los errores de carga de archivos aquí
    //   return (error);
    // }

    try {
      const result = await new Promise<string>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: 'auto', // o 'raw'
              // Otras opciones adicionales
            },
            (error: any, result: any) => {
              if (error) {
                reject(error);
              } else {
                resolve(result.secure_url);
              }
            },
          )
          .end(file.buffer);
      });

      console.log(result);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
}
