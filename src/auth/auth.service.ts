import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from '../users/user.service';
@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async validateUser(username: string, password: string) {
    const user = await this.userService.validate(username, password);
    return user;
  }
  async validateGoogle(email: string, id: string) {
    const user = await this.userService.validateGoogle(email, id);
    return user;
  }
}
