import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class AuthJwtService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async createUser(createData: CreateUserDto): Promise<User | null> {
    try {
      const newUser = new this.userModel(createData);
      await newUser.validate(); // Validar los datos antes de guardar
      await newUser.save();
      return newUser;
    } catch (error) {
      console.error(error); // Mostrar el error en la consola para depuración
      throw error; // Relanzar el error para que pueda ser manejado en la ruta
    }
  }
}
