import { Controller, Get, Redirect, Req, Res, UseFilters, UseGuards } from '@nestjs/common';
import { YandexGuard } from './auth/yandex.guard';
import { Request, Response } from 'express';
import { JwtPayload } from './auth/auth.dto';
import { AuthenticatedGuard } from './auth/authenticated.guard';
import { UnauthorizedRedirectFilter } from './auth/unauthorized-redirect.filter';

@Controller()
export class AppController {
  @Get()
  async index() {
    return '<html><body><a href="/login">Login with Yandex</a></body></html>';
  }

  @Get('login')
  @UseGuards(YandexGuard)
  async login() {
    throw new Error('Never reached');
  }

  @Get('login/callback')
  @UseGuards(YandexGuard)
  async loginCallback(@Res() res: Response) {
    res.redirect('/profile');
  }

  @Get('profile')
  @UseGuards(AuthenticatedGuard)
  @UseFilters(UnauthorizedRedirectFilter)
  async profile(@Req() req: Request) {
    const user = req.user as JwtPayload;
    return `<html><body><h1>Hello, ${user.firstName}!</h1><a href="/logout">Logout</a></body></html>`;
  }

  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    req.logOut((err) => {
      if (err) throw err;

      return res.redirect('/');
    });
  }
}
