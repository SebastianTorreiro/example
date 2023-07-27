import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';
import { Song } from './song.schema';

@Schema({ timestamps: true })
export class Album {
  @Prop({
    type: Types.ObjectId,
    ref: 'UserSchema',
    required: true,
    unique: false,
  })
  canciones: Song[];
  @Prop({ required: true, unique: false }) duracion: number;
  @Prop({ required: true, unique: true }) nombre: string;
  @Prop({ required: true, unique: false }) descripcion: string;
  @Prop({ required: true, unique: false }) imagen: string;
  @Prop({ required: true, unique: false }) precio: number;
  @Prop({ type: Types.ObjectId, ref: 'UserSchema', required: true })
  usuario: User;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
export type AlbumDocument = HydratedDocument<Album>;
