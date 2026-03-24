import { Injectable, NotFoundException } from '@nestjs/common';
import { IUser } from './user.interface';
import * as fs from 'fs';
import * as path from 'path';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  test(): string[] {
    return [];
  }
  private readonly filePath = path.join(process.cwd(), 'data', 'users.json');

  findAll(): IUser[] {
    const filePath = path.resolve(process.cwd(), 'data/users.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const users: IUser[] = JSON.parse(fileContent) as IUser[];
    return users;
  }
  create(dto: CreateUserDto): IUser {
    const users = this.findAll();
    const maxId =
      users.length > 0 ? Math.max(...users.map((u) => parseInt(u.id))) : 0;
    const newId = (maxId + 1).toString();

    const newUser: IUser = {
      id: newId,
      ...dto,
    };

    users.push(newUser);
    fs.writeFileSync(this.filePath, JSON.stringify(users, null, 2));
    return newUser;
  }

  findOne(id: string, fields?: string[]): Partial<IUser> | IUser {
    const users = this.findAll();
    const user = users.find((u) => u.id === id);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (fields === undefined) {
      return user;
    }
    const filteredUser: Record<string, unknown> = {};
    fields.forEach((field) => {
      if (field in user) {
        filteredUser[field] = (user as unknown as Record<string, unknown>)[
          field
        ];
      }
    });
    return filteredUser as Partial<IUser>;
  }
}
