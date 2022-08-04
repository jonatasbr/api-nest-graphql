import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { AuthInput } from './dto/auth.input';
import { AuthOutput } from './dto/auth.output';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(data: AuthInput): Promise<AuthOutput> {
    const user = await this.userRepository.findOne({
      where: { email: data.email },
    });
    const passAgainstTimeAttack = user?.password || 'pass';
    const validPassword = compareSync(data.password, passAgainstTimeAttack);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    if (!validPassword) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const token = await this.jwtToken(user);
    return {
      user,
      token: token,
    };
  }

  private async jwtToken(user: User): Promise<string> {
    const payload = { email: user.email, sub: user.id };
    return await this.jwtService.signAsync(payload);
  }
}
