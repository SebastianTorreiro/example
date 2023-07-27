import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { AuthJwtModule } from './auth-jwt/auth-jwt.module';
import { AlbumsModule } from './albums/albums.module';
import { SongsModule } from './songs/songs.module';
import { UserModule } from './user/user.module';
import { PlaylistModule } from './playlist/playlist.module';
import { FavoriteArtistsModule } from './favorite-artists/favorite-artists.module';
import cloudinaryConfig from './cloudinary.config';
import { MercadopagoModule } from './mercadopago/mercadopago.module';
import { PaymentController } from './payment/payment.controller';
import { PaypalModule } from './paypal/paypal.module';
import { AuthModule } from './auth/auth.module';
import { PublicationsUserModule } from './publications-user/publications-user.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // Importa el ConfigModule sin argumentos
    AlbumsModule,
    MongooseModule.forRoot(process.env.DB_HOST), // Ejemplo de uso de una variable de entorno
    AuthJwtModule,
    SongsModule,
    UserModule,
    PlaylistModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [cloudinaryConfig],
    }),
    MercadopagoModule,
    PaypalModule,
    FavoriteArtistsModule,
    AuthModule,
    PublicationsUserModule,
  ],
  controllers: [PaymentController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('a');
  }
}
