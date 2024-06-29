import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";

@Injectable()
export class SessionSerializer extends PassportSerializer {
    serializeUser(user: any, done: (err: Error, user: any) => void): any {
        process.nextTick(() => done(null, user));
    }
    deserializeUser(
        payload: any,
        done: (err: Error, payload: string) => void
    ): any {
        process.nextTick(() => done(null, payload));
    }
}