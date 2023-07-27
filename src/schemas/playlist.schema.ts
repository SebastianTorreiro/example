import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Song } from './song.schema';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class Playlist {
  [x: string]: any;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: Song.name }] })
  songs: Song[]; // Relación con el esquema de songs

  // @Prop({ required: true })
  // songs: string[]; // Relación con el esquema de songs

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name })
  user: User; // Relación con el esquema de users

  // @Prop({ required: true })
  // user: string;

  @Prop({ default: Date.now })
  creationDate: Date;
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);
export type PlaylistDocument = HydratedDocument<Playlist>;
