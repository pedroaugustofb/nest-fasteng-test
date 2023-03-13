import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto';
import { User } from '../schemas';
import { UsersRepository } from '../repository';
import { IUsersService } from '../interfaces';

@Injectable() // permite que a classe seja injetada em outros lugares
/** @see (Document){IUsersService} */
export class UsersService implements IUsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser({
    uuid,
    connections,
    lastLoginList,
    photo,
  }: CreateUserDto): Promise<User> {
    //cria um usuário no banco de dados e retorna o usuário criado
    return this.usersRepository.create({
      _id: uuid,
      connections,
      lastLoginList,
      photo,
    });
  }

  async getUser(id: string): Promise<User> {
    return this.usersRepository.findOne({ _id: id }); // busca um usuário com o id passado no banco de dados
  }

  async updateUser(body: User): Promise<User> {
    return this.usersRepository.findOneAndUpdate({ _id: body._id }, body); // atualiza um usuário no banco de dados
  }

  async deleteUser(id: string): Promise<User> {
    return this.usersRepository.findOneAndDelete({ _id: id });
  }
}
