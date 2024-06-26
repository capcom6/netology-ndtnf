import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle()
            .pipe(
                map((data) => {
                    if (typeof data !== "object" && !Array.isArray(data)) {
                        return data;
                    }

                    return {
                        status: "success",
                        data,
                    }
                }),
                // catchError((err) => {
                //     return of({
                //         status: "fail",
                //         data: err.response || err,
                //     })
                // })
            );
    }

}