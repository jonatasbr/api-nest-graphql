import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compareSync } from 'bcryptjs';
import { UserService } from '../user/user.service';
import { AuthInput } from './dto/auth.input';
import { AuthOutput } from './dto/auth.output';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(data: AuthInput): Promise<AuthOutput> {
    const user = await this.userService.getUserByEmail(data.email);
    const passAgainstTimeAttack = user.password || 'pass';
    const validPassword = compareSync(data.password, passAgainstTimeAttack);
    if (!user) {
      throw new UnauthorizedException('UU Credenciais inválidas');
    }
    if (!validPassword) {
      throw new UnauthorizedException('PP Credenciais inválidas');
    }
    return {
      user,
      token: 'token',
    };
  }
}
