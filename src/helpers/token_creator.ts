import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  private revokedTokens: string[] = [];
  constructor(private configService: ConfigService) {}

  createToken(user: any): string {
    const payload = {
      sub: user.id,
      iat: moment().unix(),
      exp: moment().add(24, 'hours').unix(),
    };
    const secretKey = this.configService.get<string>('SECRET_TOKEN');
    return jwt.sign(payload, secretKey);
  }
  deleteToken(token: string): void {
    try {
      const secretKey = this.configService.get<string>('SECRET_TOKEN');
      const decodedToken: any = jwt.verify(token, secretKey);

      this.revokedTokens.push(token);

      const expirationTime = moment(decodedToken.exp * 1000).add(24, 'hours');
      setTimeout(() => {
        const index = this.revokedTokens.indexOf(token);
        if (index !== -1) {
          this.revokedTokens.splice(index, 1);
        }
      }, expirationTime.diff(moment()));
    } catch (error) {
      console.error('Invalid or expired token:', error.message);
    }
  }
  isTokenRevoked(token: string): boolean {
    return this.revokedTokens.includes(token);
  }
}
