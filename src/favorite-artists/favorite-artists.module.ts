import { Module } from '@nestjs/common';
import { FavoriteArtistsController } from './favorite-artists.controller';
import { FavoriteArtistsService } from './favorite-artists.service';
import { ConfigModule } from '@nestjs/config';

import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    ConfigModule,
  ],
  controllers: [FavoriteArtistsController],
  providers: [FavoriteArtistsService],
})
export class FavoriteArtistsModule {}
