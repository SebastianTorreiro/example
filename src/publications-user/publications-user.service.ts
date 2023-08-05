import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Publications } from 'src/schemas/publications.schema';
import { CreatePublicationDto } from 'src/dto/create-publication.dto';

@Injectable()
export class PublicationsUserService {
  constructor(
    @InjectModel(Publications.name)
    private readonly publicationsModel: Model<Publications>,
  ) {}

  async findAll(): Promise<Publications[]> {
    try {
      return await this.publicationsModel
        .find()
        .populate('user')
        .populate('song')
        .exec();
    } catch (error) {
      throw new Error('Error al obtener las publicaciones');
    }
  }

  async findById(id: string): Promise<Publications> {
    try {
      return await this.publicationsModel
        .findById(id)
        .populate('user')
        .populate('song')
        .exec();
    } catch (error) {
      throw new Error('Error al obtener la publicación');
    }
  }

  async create(publication: CreatePublicationDto): Promise<Publications> {
    try {
      const newPublication = new this.publicationsModel(publication);
      return await newPublication.save();
    } catch (error) {
      throw new Error('Error al crear la publicación');
    }
  }

  async update(id: string, publication: Publications): Promise<Publications> {
    try {
      return await this.publicationsModel
        .findByIdAndUpdate(id, publication, { new: true })
        .exec();
    } catch (error) {
      throw new Error('Error al actualizar la publicación');
    }
  }

  async delete(id: string): Promise<Publications> {
    try {
      return await this.publicationsModel.findByIdAndRemove(id).exec();
    } catch (error) {
      throw new Error('Error al eliminar la publicación');
    }
  }
}
