import { Controller, Get, Head, Req, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  @Head()
  healthHead() {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
