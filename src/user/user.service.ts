import { Injectable, NotFoundException } from '@nestjs/common';
import { IUser } from './user.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UserService {
  test(): string[] {
    return [];
  }

  findAll(): IUser[] {
    const filePath = path.resolve(process.cwd(), 'data/users.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const users: IUser[] = JSON.parse(fileContent) as IUser[];
    return users;
  }

  findOne(id: string, fields?: string[]): Partial<IUser> | IUser {
    const users = this.findAll();
    const user = users.find((u) => u.id === id);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!fields || fields.length === 0) {
      return user;
    }
    const filteredUser: Record<string, unknown> = {};
    fields.forEach((field) => {
      if (field in user) {
        filteredUser[field] = (user as unknown as Record<string, unknown>)[field];
      }
    });
    return filteredUser as Partial<IUser>;
  }
}
