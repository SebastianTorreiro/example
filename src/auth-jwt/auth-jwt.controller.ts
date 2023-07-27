import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { AuthJwtService } from '../auth-jwt/auth-jwt.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { TokenService } from '../helpers/token_creator';

@ApiTags('Auth-jwt')
@Controller('auth-jwt')
export class AuthJwtController {
  constructor(
    private AuthUserService: AuthJwtService,
    private tokenService: TokenService,
  ) {}

  @ApiOperation({ summary: 'Registrarse en la web.' })
  @Post('/register')
  async register(@Body() registerDto: CreateUserDto, @Res() res) {
    try {
      const { name, surname, username, email, password, artist } = registerDto;
      if (!name || !surname || !username || !email) {
        console.log(res.sendStatus(HttpStatus.BAD_REQUEST));
        return res.sendStatus(HttpStatus.BAD_REQUEST);
      }

      const registeredUser = await this.AuthUserService.getUserByEmail(email);
      if (registeredUser) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'EMAIL YA REGISTRADO' });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = await this.AuthUserService.createUser({
        name,
        surname,
        username,
        artist,
        email,
        password: hashedPassword,
      });

      const { ...userWithoutPassword } = user;
      return res.status(HttpStatus.OK).json(userWithoutPassword);
    } catch (err) {
      console.log(err);
      return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Iniciar sesión en la web.' })
  @Post('/login')
  async login(@Body() loginDto: LoginUserDto, @Res() res) {
    try {
      const { email, password } = loginDto;

      const user = await this.AuthUserService.getUserByEmail(email);
      if (!user) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'USUARIO NO ENCONTRADO' });
      }

      const validatedPassword = await bcrypt.compare(password, user.password);
      if (!validatedPassword) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'USUARIO O CONTRASEÑA INCORRECTA' });
      }

      const token = this.tokenService.createToken(user);

      const { _id, username } = user;

      return res.status(HttpStatus.OK).json({ _id, username, token });
    } catch (err) {
      console.log(err.message);
      return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Cerrar sesion' })
  @Post('/logout')
  async logout(@Res() res, @Body('token') token: string) {
    try {
      this.tokenService.deleteToken(token);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'El usuario a cerrado sesion' });
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.BAD_GATEWAY);
    }
  }
}
