import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jwt-simple';
import * as moment from 'moment';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      throw new UnauthorizedException('ACCESO DENEGADO');
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
      const payload = jwt.decode(token, process.env.SECRET_TOKEN);
      const { exp } = payload;

      if (exp <= moment().unix()) {
        throw new UnauthorizedException('SESION EXPIRADA');
      }

      req['user'] = payload.sub;
      next();
    } catch (error) {
      throw new UnauthorizedException('TOKEN INVALIDO');
    }
  }
}
