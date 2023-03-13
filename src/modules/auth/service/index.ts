import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { UsersRepository } from 'src/modules/users/repository';
import { User } from 'src/modules/users/schemas';
import { Token } from 'src/utils';
import { InputLoginUserDto, OutputLoginUserDto } from '../dto';
import { IAuthService } from '../interfaces';

@Injectable() // Injeta a classe no NestJS
/** @see (Document){IAuthService} */
export class AuthService implements IAuthService {
  constructor(private readonly usersRepository: UsersRepository) {}

  /** @see (IAuthService)  */
  async login(data: InputLoginUserDto): Promise<OutputLoginUserDto> {
    //faz na API da Rox a autenticação do usuário
    return axios
      .post('https://fastengapp.com.br/minhaconta/api/auth', data)
      .then(async (response) => {
        // caso o código de resposta não seja 200, lança uma exceção de usuário não autorizado
        if (response.data.response_code !== '200 OK')
          throw new UnauthorizedException('Usuário não autorizado!');
        else {
          //busca no banco de dados o usuário com o id retornado pela API
          return await this.usersRepository
            .findOne({ _id: response.data.data.uuid })
            .then((user: User) => {
              if (user) {
                {
                  // caso o usuário já exista, atualiza a lista de logins
                  // caso a lista de logins tenha o tamanho máximo, remove o primeiro elemento
                  user.lastLoginList.length >= user.connections &&
                    user.lastLoginList.shift();

                  user.lastLoginList.push(new Date());
                }

                //Gera um token com o nome do plano, email, nome, id e data do último login com duração de 10 horas
                const token = new Token(
                  {
                    planName: response.data.data.plan_name,
                    email: data.email,
                    name: response.data.data.name,
                    userId: user._id,
                    lastLogin:
                      user.lastLoginList[user.lastLoginList.length - 1],
                  },
                  '10h'
                );

                //atualiza o usuário no banco de dados
                return this.usersRepository
                  .findOneAndUpdate({ _id: user._id }, user)
                  .then((user: User) => {
                    //rota retorna esse objeto caso login seja bem sucedido
                    return {
                      success: true,
                      token: token.value,
                      user,
                      name: response.data.data.name,
                      email: data.email,
                      planName: response.data.data.plan_name,
                    };
                  })
                  .catch((error) => {
                    throw new Error(error);
                  });
              }
              // caso o usuário não esteja no banco de dados, usuário não autorizado!
              else throw new UnauthorizedException('Usuário não autorizado!');
            });
        }
      })
      .catch((error) => {
        throw new Error(error);
      });
  }
}
