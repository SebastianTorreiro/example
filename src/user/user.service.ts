import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../schemas/user.schema';
import { ImageType, paymentType } from '../enums/enums';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly configService: ConfigService,
  ) {}

  async getAll(): Promise<User[] | null> {
    return this.userModel.find().exec();
  }

  async getAllArtist({
    limit,
    offset,
  }: PaginationQueryDto): Promise<User[] | null> {
    return this.userModel.find().skip(offset).limit(limit).exec();
  }

  async getById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  // async getByIdAndSave(usuario: string): Promise<User | null> {
  //   const user = this.userModel.findById(usuario).exec();
  //   user.save()
  //   return
  // }

  async deleteById(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async updateById(
    id: string,
    updatedUserData: UpdateUserDto,
  ): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(id, updatedUserData, { new: true })
      .exec();
  }

  async updatePaymentById(
    id: string,
    paymentType: paymentType,
  ): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(id, { [paymentType]: true }, { new: true })
      .exec();
  }

  async updateUserPhoto(
    id: string,
    photoUrl: string,
    imageType: ImageType,
  ): Promise<User | null> {
    const updateData = { [imageType]: photoUrl };

    return this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }
}
