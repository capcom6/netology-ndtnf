import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    ForbiddenException,
    HttpException,
    UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(ForbiddenException, UnauthorizedException)
export class UnauthorizedRedirectFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();

        response.status(status).redirect('/');
    }
}