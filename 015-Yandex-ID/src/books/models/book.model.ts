import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({ timestamps: true })
export class Book {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    authors: string;

    @Prop({ default: false })
    favorite: boolean;

    @Prop()
    fileCover?: string;

    @Prop()
    fileName?: string;

    @Prop()
    fileBook?: string;
}

export type BookDocument = HydratedDocument<Book>;

export const BookModel = SchemaFactory.createForClass(Book);
