import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

//Database
import { MongooseModule } from '@nestjs/mongoose';

//Middlewares
import { AuthMiddleware } from './modules/auth/middlewares';

//Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://pedroaugustofolb:Y8EihIjEVITSwmk1@pavitech.yioxfsp.mongodb.net/?retryWrites=true&w=majority'
    ),
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware) // aplica o AuthMiddleWare para todas as rotas excluindo a de login
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST }, // libera a rota de login da autenticação
        { path: 'users', method: RequestMethod.POST } // libera a rota de cadastro de usuários
      )
      .forRoutes('*');
  }
}
