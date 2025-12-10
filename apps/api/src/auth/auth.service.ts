import { getConfig } from '@app/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcryptjs';

export interface User {
  id: number;
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  private users: User[] = [
    {
      id: 1,
      email: 'user@example.com',
      password: bcrypt.hashSync('password', 10),
    },
  ];

  constructor(private jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = this.users.find(u => u.email === email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, {
      secret: getConfig('jwt.secret'),
      expiresIn: getConfig('jwt.accessExpiresIn', '15m'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: getConfig('jwt.refreshSecret'),
      expiresIn: getConfig('jwt.refreshExpiresIn', '7d'),
    });
    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: getConfig('jwt.refreshSecret'),
      });
      const user = this.users.find(u => u.id === payload.sub);
      if (!user) throw new UnauthorizedException();
      const newAccessToken = this.jwtService.sign(
        { email: user.email, sub: user.id },
        {
          secret: getConfig('jwt.secret'),
          expiresIn: getConfig('jwt.accessExpiresIn', '15m'),
        },
      );
      return { access_token: newAccessToken };
    } catch {
      throw new UnauthorizedException();
    }
  }
}
