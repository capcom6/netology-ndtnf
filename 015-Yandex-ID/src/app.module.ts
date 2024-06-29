import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from "passport";
import { randomBytes } from 'crypto';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URL || 'mongodb://localhost:27017/library'),
    BooksModule,
    AuthModule,
    RouterModule.register([
      {
        path: 'api',
        module: AuthModule,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieParser(),
        session({
          secret: process.env.SESSION_SECRET || randomBytes(32).toString('hex'),
          resave: false,
          saveUninitialized: false,
        }),
        passport.session()
      )
      .forRoutes(AppController);
  }
}
