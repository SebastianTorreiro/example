import { Injectable } from '@nestjs/common';
import { Preference } from 'mercadopago';
import { mercadoItemDto } from 'src/dto/mercadopago-item.dto';

@Injectable()
export class MercadopagoService {
  private mercadopago: any;

  constructor() {
    this.mercadopago = require('mercadopago');
    this.mercadopago.configure({
      access_token: process.env.ACCESS_TOKEN,
    });
  }

  async createPayment(order: mercadoItemDto): Promise<Preference> {
    try {
      console.log(order);
      const user_id = order.user_id;
      const id = order.id;

      const preference = {
        items: [
          {
            title: order.id,
            unit_price: order.unit_price,
            quantity: order.quantity,
          },
        ],
        back_urls: {
          success: `${process.env.SELF_DEPLOY}`,
          failure: `${process.env.SELF_DEPLOY}`,
          pending: `${process.env.SELF_DEPLOY}`,
        },
        auto_return: 'approved',
        notification_url: `https://0443-181-169-126-137.ngrok.io/user/addsong?userid=${user_id}&songid=${id}`,
      };

      console.log(preference);

      const createdPref = await this.mercadopago.preferences.create(preference);

      console.log('prefCreada--------------' + createdPref);

      if (!createdPref) {
        throw new Error('Ocurrio un error creando el pago en mercadopago');
      }

      return createdPref;
    } catch (error) {
      throw error;
    }
  }
}
