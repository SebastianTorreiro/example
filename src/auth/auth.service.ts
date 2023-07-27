import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken';
import * as qs from 'qs';
import { Injectable } from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getGoogleOAuthTokens(code: string) {
    const url = 'https://oauth2.googleapis.com/token';
    const values = {
      code,
      clientId: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.CLIENT_URL,
      grant_type: 'authorization_code',
    };
    console.log(qs.stringify(values));

    console.log(process.env.GOOGLE_CLIENT_ID);
    console.log(process.env.GOOGLE_CLIENT_SECRET);
    console.log(process.env.CLIENT_URL);

    try {
      const res = await axios.post(url, qs.stringify(values), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      console.log(res);

      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log(error);
      console.log(error.response.data.error, 'Error fetch google tokens');
      throw new Error(error.message);
    }
  }

  async getGoogleUser(id_token: string, access_token: string) {
    try {
      const res = await axios.get(
        `https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${access_token}`,
        {
          headers: {
            Authorization: `Bearer ${id_token}`,
          },
        },
      );

      const email = res.data.email;
      const name = res.data.name;
      const firstName = name.split(' ')[0];
      const googleId = res.data.id;

      // Verificar si el usuario ya existe en la base de datos
      let user = await this.userModel.findOne({ email });
      if (!user) {
        // Si el usuario no existe, crear uno nuevo utilizando el esquema User
        user = await this.userModel.create({
          name,
          email,
          username: firstName,
          googleId,
          // Otros campos según el esquema User que puedas tener
        });
        await user.save();
      }

      // Generar un token de sesión para el usuario
      const token = this.generateSessionToken(user._id);

      return { user, token };
    } catch (error) {
      console.log(error, 'Error fetch user google.');
      throw new Error('Error fetching Google user');
    }
  }
  private generateSessionToken(userId: string): string {
    const secretKey = process.env.SECRET_TOKEN; // Obtiene el valor de la variable de entorno SECRET_KEY

    const expiresIn = '1d'; // Tiempo de expiración del token (ejemplo: 1 día)

    const payload = { userId };
    const options = { expiresIn };

    return jwt.sign(payload, secretKey, options);
  }
}
