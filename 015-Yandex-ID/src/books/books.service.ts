import { Injectable } from '@nestjs/common';
import { BookDto, CreateBookDto, ReplaceBookDto, UpdateBookDto } from './dto/book.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from './models/book.model';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel('Book') private readonly bookModel: Model<Book>
  ) { }

  async select(): Promise<BookDto[]> {
    return (await this.bookModel.find({}).exec()).map((book) => new BookDto(book));
  }

  async findById(id: string): Promise<BookDto> {
    const book = await this.bookModel.findById(id).exec();
    if (!book) {
      return null;
    }

    return new BookDto(book);
  }

  async insert(book: CreateBookDto): Promise<BookDto> {
    await this.bookModel.validate(book);

    return new BookDto(await this.bookModel.create(book));
  }

  async replace(id: string, book: ReplaceBookDto): Promise<BookDto> {
    await this.bookModel.validate(book);

    return new BookDto(
      await this.bookModel.findOneAndReplace(
        { _id: id },
        { ...book, _id: id },
        { new: true }
      )
    );
  }

  async delete(id: string): Promise<BookDto> {
    return new BookDto(await this.bookModel.findByIdAndDelete(id));
  }
}
