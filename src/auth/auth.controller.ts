import { Body, Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google/oauth/tokens')
  async getGoogleOAuthTokens(@Query('code') code: string) {
    // Usar @Query en lugar de @Body
    console.log(code);
    try {
      const tokens = await this.authService.getGoogleOAuthTokens(code);
      return tokens;
    } catch (error) {
      console.log(error);
      return { error: 'Error fetching Google tokens' };
    }
  }

  @Get('google/user')
  async getGoogleUser(
    @Body('id_token') id_token: string,
    @Body('access_token') access_token: string,
  ) {
    try {
      const user = await this.authService.getGoogleUser(id_token, access_token);
      return user;
    } catch (error) {
      return { error: 'Error fetching Google user' };
    }
  }
}
