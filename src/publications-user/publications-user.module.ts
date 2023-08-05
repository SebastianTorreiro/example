import { Module } from '@nestjs/common';
import { PublicationsUserController } from './publications-user.controller';
import { PublicationsUserService } from './publications-user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from 'src/user/user.service';
import { User, UserSchema } from 'src/schemas/user.schema';
import {
  Publications,
  PublicationsSchema,
} from 'src/schemas/publications.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Publications.name, schema: PublicationsSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [PublicationsUserController],
  providers: [PublicationsUserService, UserService],
})
export class PublicationsUserModule {}
