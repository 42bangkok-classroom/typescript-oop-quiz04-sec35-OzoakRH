import { Injectable } from '@nestjs/common';
import { IUser } from './user.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UserService {
  findAll(): IUser[] {
    const filePath = path.resolve(process.cwd(), 'data/users.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const users: IUser[] = JSON.parse(fileContent) as IUser[];
    return users;
  }
  test(): string[] {
    return [];
  }
}
