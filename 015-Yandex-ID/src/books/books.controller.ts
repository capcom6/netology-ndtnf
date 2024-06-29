import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto, ReplaceBookDto } from './dto/book.dto';
import mongoose from 'mongoose';
import { ParseObjectIdPipe } from '../pipes/parse-objectid.pipe';
import { ValidationPipe } from '../pipes/validation.pipe';
import { createBookSchema } from './schemas/book.schema';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('books')
@UseGuards(JwtGuard)
export class BooksController {
  constructor(private readonly booksService: BooksService) { }

  @Get()
  async select() {
    return await this.booksService.select();
  }

  @Get(':id')
  async findById(@Param('id', ParseObjectIdPipe) id: string) {
    const book = await this.booksService.findById(id);
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return book
  }

  @Post()
  @HttpCode(201)
  @UsePipes(new ValidationPipe(createBookSchema))
  async insert(@Body() book: CreateBookDto) {
    try {
      return await this.booksService.insert(book);
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new BadRequestException(error);
      }

      throw error;
    }
  }

  @Put(':id')
  async replace(@Param('id', ParseObjectIdPipe) id: string, @Body() book: ReplaceBookDto) {
    try {
      const newBook = await this.booksService.replace(id, book);
      if (!newBook) {
        throw new NotFoundException('Book not found');
      }
      return newBook;
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new BadRequestException(error);
      }

      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', ParseObjectIdPipe) id: string) {
    await this.booksService.delete(id);
  }
}
