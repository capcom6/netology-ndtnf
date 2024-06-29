import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    passwordHash: string;

    @Prop({ required: true })
    firstName: string;

    @Prop()
    lastName?: string;
}

export type UserDocument = HydratedDocument<User>;

export const UserModel = SchemaFactory.createForClass(User);
