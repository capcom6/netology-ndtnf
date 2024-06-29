import * as Joi from "joi";

export class UserDto {
    id: string
    email: string;
    firstName: string;
    lastName?: string;
    accessToken: string;

    constructor(partial: Partial<UserDto>) {
        this.id = partial.id;
        this.email = partial.email;
        this.firstName = partial.firstName;
        this.lastName = partial.lastName;
        this.accessToken = partial.accessToken;
    }
}

export type NewUserDto = Omit<UserDto, 'id' | 'accessToken'>

export class JwtPayload {
    id: string
    email: string;
    firstName: string;

    constructor(required: Required<JwtPayload>) {
        this.id = required.id;
        this.email = required.email;
        this.firstName = required.firstName;
    }
}

export interface SignupRequestDto {
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
}

export const SignupRequestSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3),
});

export interface SigninRequestDto {
    email: string;
    password: string;
}

export const SigninRequestSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});