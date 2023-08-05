import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { Publications } from 'src/schemas/publications.schema';
import { PublicationsUserService } from './publications-user.service';
import { CreatePublicationDto } from 'src/dto/create-publication.dto';

@Controller('publications')
export class PublicationsUserController {
  constructor(
    private readonly publicationsUserService: PublicationsUserService,
  ) {}

  @Get()
  async getAllPublications() {
    try {
      const publications = await this.publicationsUserService.findAll();
      return {
        statusCode: HttpStatus.OK,
        data: publications,
      };
    } catch (error) {
      throw new NotFoundException('Error al obtener las publicaciones');
    }
  }

  @Get(':id')
  async getPublicationById(@Param('id') id: string) {
    try {
      const publication = await this.publicationsUserService.findById(id);
      if (!publication) {
        throw new NotFoundException('Publicación no encontrada');
      }
      return {
        statusCode: HttpStatus.OK,
        data: publication,
      };
    } catch (error) {
      throw new NotFoundException('Error al obtener la publicación');
    }
  }

  @Post()
  async createPublication(@Body() publication: CreatePublicationDto) {
    try {
      const createdPublication = await this.publicationsUserService.create(
        publication,
      );
      return {
        statusCode: HttpStatus.CREATED,
        data: createdPublication,
      };
    } catch (error) {
      throw new NotFoundException('Error al crear la publicación');
    }
  }

  @Put(':id')
  async updatePublication(
    @Param('id') id: string,
    @Body() publication: Publications,
  ) {
    try {
      const updatedPublication = await this.publicationsUserService.update(
        id,
        publication,
      );
      if (!updatedPublication) {
        throw new NotFoundException('Publicación no encontrada');
      }
      return {
        statusCode: HttpStatus.OK,
        data: updatedPublication,
      };
    } catch (error) {
      throw new NotFoundException('Error al actualizar la publicación');
    }
  }

  @Delete(':id')
  async deletePublication(@Param('id') id: string) {
    try {
      const deletedPublication = await this.publicationsUserService.delete(id);
      if (!deletedPublication) {
        throw new NotFoundException('Publicación no encontrada');
      }
      return {
        statusCode: HttpStatus.OK,
        data: deletedPublication,
      };
    } catch (error) {
      throw new NotFoundException('Error al eliminar la publicación');
    }
  }
}
