import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookCommentsService } from './book-comments.service';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { BookComment, BookCommentModel } from './models/book-comment.model';
import { Book, BookModel } from './models/book.model';
import { BooksGateway } from './books.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Book.name, schema: BookModel },
      { name: BookComment.name, schema: BookCommentModel },
    ])
  ],
  controllers: [BooksController],
  providers: [BooksService, BookCommentsService, BooksGateway],
  exports: [],
})
export class BooksModule { }
