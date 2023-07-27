import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { Song } from './song.schema';
import { IsArray, IsOptional } from 'class-validator';
import { Album } from './album.schema';

@Schema({ timestamps: true })
export class User extends Document {
  @IsOptional() // Haciendo el campo "surname" opcional
  @Prop({ unique: true })
  googleId?: string; // Nuevo campo "googleId"

  @Prop({ required: true }) // Haciendo el campo "name" requerido
  name: string;

  @Prop()
  @IsOptional() // Haciendo el campo "surname" opcional
  surname?: string;

  @Prop({ default: false })
  @IsOptional() // Haciendo el campo "artist" opcional
  artist?: boolean;

  @Prop({ unique: true })
  @IsOptional() // Haciendo el campo "username" opcional
  username?: string;

  @Prop({ default: null })
  @IsOptional()
  genre?: string;

  @IsOptional()
  @Prop({ type: [{ type: Types.ObjectId }] })
  @IsArray()
  followers?: string[];

  @Prop({
    default:
      'https://res.cloudinary.com/dnemqmc7a/image/upload/c_pad,b_auto:predominant,fl_preserve_transparency/v1689019059/image_bahgnt.jpg?_s=public-apps',
  })
  @IsOptional() // Haciendo el campo "profilePhoto" opcional
  profilePhoto?: string;

  @Prop({ type: [{ type: Types.ObjectId }] })
  @IsOptional() // Haciendo el campo "favoriteArtists" opcional
  favoriteArtists?: string[]; // Array de IDs de artistas favoritos

  @Prop({ unique: true })
  @IsOptional() // Haciendo el campo "email" opcional
  email?: string;

  @Prop({
    default:
      'https://res.cloudinary.com/dnemqmc7a/image/upload/c_pad,b_auto:predominant,fl_preserve_transparency/v1689019059/image_bahgnt.jpg?_s=public-apps',
  })
  coverPhoto: string;

  @Prop()
  @IsOptional() // Haciendo el campo "password" opcional
  password?: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Song' }] })
  @IsOptional() // Haciendo el campo "songsPurchased" opcional
  songsPurchased?: Song[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Song' }] })
  @IsOptional() // Haciendo el campo "songsUplodaded" opcional
  songsUplodaded?: Song[];

  @Prop()
  @IsOptional()
  description?: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Album' }] })
  @IsOptional()
  albumes: Album[];
  // @Prop()
  // @IsOptional()

  @Prop({ default: false })
  @IsOptional()
  mercadopagoApproved: boolean;

  @Prop({ default: false })
  @IsOptional()
  paypalApproved: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
