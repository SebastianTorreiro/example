import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { MercadopagoService } from '../mercadopago/mercadopago.service';
import { PaypalService } from '../paypal/paypal.service';
import { paypalItemDto } from 'src/dto/paypal-item.dto';
import { mercadoItemDto } from 'src/dto/mercadopago-item.dto';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { SongsService } from 'src/songs/songs.service';
import { UserService } from 'src/user/user.service';

@ApiTags('Pagos')
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly mercadopagoService: MercadopagoService,
    private readonly paypalService: PaypalService,
    private readonly songService: SongsService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ summary: 'Crear un link de pago' })
  @Post('mercadopago')
  async createPayment(@Body() items: mercadoItemDto, @Res() res) {
    try {
      console.log('Entrando al try');

      const song = await this.songService.getById(items.id);
      console.log(song);

      const user = await this.userService.getById(items.user_id);
      console.log(user);
      const songsPurchased = user.songsPurchased;

      if (songsPurchased.includes(song._id)) {
        return res
          .status(HttpStatus.OK)
          .json({ message: 'El usuario ya adquirio esta cancion' });
      }
      console.log('-------Trying preference-----');

      const preference = await this.mercadopagoService.createPayment(items);
      console.log(preference);

      if (!preference) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send('No se pudo crear la preferencia de pago');
      }
      return res.status(HttpStatus.OK).json(preference.body.init_point);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ 'Error al procesar el pago': error });
    }
  }

  @ApiOperation({ summary: 'Crear un link de pago' })
  @ApiParam({ name: '' })
  @Post('paypal/create')
  async createPaypalPayment(@Body() items: paypalItemDto, @Res() res) {
    try {
      const order = await this.paypalService.createOrder(items);

      if (!order) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send('No se pudo crear la preferencia de pago');
      }

      return res.status(HttpStatus.OK).json(order.data.links[1]);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ 'Error al procesar el pago': error });
    }
  }

  @Get('paypal/capture')
  async capturepaypalPayment(@Req() req, @Res() res) {
    try {
      const { token } = req.query;

      const response = await this.paypalService.captureOrder(token);

      if (!response) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send('Ocurrio un error completando el pago');
      }

      return res.status(HttpStatus.OK).send('Payment copmlete');
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Ocurrio un error completando el pago');
    }
  }
}
