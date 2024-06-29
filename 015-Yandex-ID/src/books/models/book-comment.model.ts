import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({ collection: 'comments', timestamps: { updatedAt: false } })
export class BookComment {
    @Prop({ required: true, index: true })
    bookId: string;

    @Prop({ required: true })
    text: string;
}

export type BookCommentDocument = HydratedDocument<BookComment>;

export const BookCommentModel = SchemaFactory.createForClass(BookComment);
