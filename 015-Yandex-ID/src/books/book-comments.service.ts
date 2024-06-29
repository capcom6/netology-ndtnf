import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BooksService } from './books.service';
import { BookCommentDto, CreateBookCommentDto } from './dto/book-comment.dto';
import { BookComment } from './models/book-comment.model';

@Injectable()
export class BookCommentsService {
    constructor(
        @InjectModel(BookComment.name) private readonly bookCommentModel: Model<BookComment>,
        private readonly booksSvc: BooksService
    ) { }

    async insert(comment: CreateBookCommentDto): Promise<BookCommentDto> {
        const book = await this.booksSvc.findById(comment.bookId);
        if (!book) {
            throw new Error('Book not found');
        }

        return new BookCommentDto(await this.bookCommentModel.create(comment));
    }

    async findAllBookComments(bookId: string): Promise<BookCommentDto[]> {
        return (await this.bookCommentModel.find({ bookId }, null, { sort: { created_at: 1 } }).exec())
            .map((comment) => new BookCommentDto(comment));
    }
}
