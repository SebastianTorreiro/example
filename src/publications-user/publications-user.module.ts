import { Module } from '@nestjs/common';
import { PublicationsUserController } from './publications-user.controller';
import { PublicationsUserService } from './publications-user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from '../user/user.service';
import { User, UserSchema } from '../schemas/user.schema';
import {
  Publications,
  PublicationsSchema,
} from '../schemas/publications.schema';

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
