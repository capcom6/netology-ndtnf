import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-yandex";
import { ConfigService } from "@nestjs/config";
import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtPayload } from "./auth.dto";


@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService,
        private readonly authService: AuthService
    ) {
        super({
            clientID: configService.get<string>('YANDEX_CLIENT_ID'),
            clientSecret: configService.get<string>('YANDEX_CLIENT_SECRET'),
            callbackURL: configService.get<string>('YANDEX_CALLBACK_URL'),
        })
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<JwtPayload> {
        const email = profile.emails?.length ? profile.emails[0].value : undefined;
        if (!email) {
            throw new Error('Email not found');
        }

        const user = await this.authService.findOrCreate({ email, firstName: profile.displayName }, undefined);

        return new JwtPayload({ ...user });
    }


}