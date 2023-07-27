import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';
import { Song } from './song.schema';

@Schema({ timestamps: true })
export class Publications extends Document {
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  user: User[];

  @Prop()
  content: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Song' })
  song: Song;
}

export const PublicationsSchema = SchemaFactory.createForClass(Publications);
