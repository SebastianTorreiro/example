import { Controller, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { paymentType } from 'src/enums/enums';
import { User } from 'src/schemas/user.schema';
import { UserService } from 'src/user/user.service';

@Controller('status')
export class MercadopagoController {
  constructor(
    @InjectModel(User.name)
    private userService: UserService, // private playlistModel: Model<User>
  ) {}
  @Post('/mercadopago/:id')
  async configureMp(@Param('id') id: string, @Res() res) {
    try {
      const user = await this.userService.getById(id);
      if (!user) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'User not found' });
      }
      const userUpdated = await this.userService.updatePaymentById(
        id,
        paymentType.MP,
      );

      return res.status(HttpStatus.OK).json(userUpdated);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal server error' });
    }
  }

  @Post('/paypal/:id')
  async configurePaypal(@Param('id') id: string, @Res() res) {
    try {
      const user = await this.userService.getById(id);
      if (!user) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'User not found' });
      }
      const userUpdated = await this.userService.updatePaymentById(
        id,
        paymentType.PAYPAL,
      );

      return res.status(HttpStatus.OK).json(userUpdated);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal server error' });
    }
  }
}
