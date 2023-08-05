import { Injectable } from '@nestjs/common';
// import { PayPalHttpClient, core } from '@paypal/checkout-server-sdk';
import axios from 'axios';
import { paypalItemDto } from 'src/dto/paypal-item.dto';

@Injectable()
export class PaypalService {
  // private paypalClient: PayPalHttpClient;

  // constructor() {
  //   this.paypalClient = new core.PayPalHttpClient(this.environment());
  // }

  // environment() {
  //   const clientId = process.env.PAYPAL_CLIENT_ID;
  //   const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  //   return new core.SandboxEnvironment(clientId, clientSecret);
  // }

  async createOrder(items: paypalItemDto) {
    const order = {
      purchase_units: [items],
      intent: 'CAPTURE',
      application_context: {
        brand_name: 'SoundWave',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${process.env.SELF_API}payment/paypal/capture`,
        cancel_url: `${process.env.SELF_DEPLOY}`, //aqui que te enive de vuelta a la pagina de home?
      },
    };

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    try {
      const {
        data: { access_token },
      } = await axios.post(
        `${process.env.PAYPAL_API}/v1/oauth2/token`,
        params,
        {
          auth: {
            username: process.env.PAYPAL_CLIENT_ID,
            password: process.env.PAYPAL_CLIENT_SECRET,
          },
        },
      );

      const response = await axios.post(
        `${process.env.PAYPAL_API}/v2/checkout/orders`,
        order,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      if (!response) {
        throw new Error('Ocurrio un problema creando la orden');
      }

      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  async captureOrder(token: string) {
    try {
      const response = await axios.post(
        `${process.env.PAYPAL_API}/v2/checkout/orders/${token}/capture`,
        {},
        {
          auth: {
            username: process.env.PAYPAL_CLIENT_ID,
            password: process.env.PAYPAL_CLIENT_SECRET,
          },
        },
      );
      if (!response) {
        throw new Error('Ocurrio un error recuperando la orden');
      }

      return response;
    } catch (error) {
      throw new Error(error);
    }
  }
}
