import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { getModelToken } from '@nestjs/mongoose';
import { Book } from './models/book.model';
import { BookDto } from './dto/book.dto';

describe('BooksService', () => {
  let service: BooksService;

  beforeEach(async () => {
    const book = {
      _id: '1',
      title: 'title',
      author: 'author',
    };
    const bookModel = {
      find: () => {
        return {
          exec: () => {
            return Promise.resolve([
              book,
            ]);
          },
        };
      },
      findById: (id: string) => {
        return {
          exec: () => {
            return id === '1' ? Promise.resolve(book) : Promise.resolve(null);
          },
        };
      },
      validate: jest.fn(),
      create: (book) => {
        return {
          ...book,
          _id: '1',
        };
      },
      findOneAndReplace: (filter, replacement, options) => {
        return {
          ...replacement,
          ...filter,
        };
      },
      findByIdAndDelete: (id) => {
        return {
          ...book,
          _id: id,
        };
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getModelToken(Book.name),
          useValue: bookModel,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('select', () => {
    it('should return an array of books', async () => {
      const books = await service.select();
      expect(books).toBeInstanceOf(Array);
      expect(books).toHaveLength(1);
      expect(books[0].title).toBe('title');
    });
  });

  describe('findById', () => {
    it('should return a book', async () => {
      const book = await service.findById('1');
      expect(book).toBeInstanceOf(BookDto);
      expect(book.title).toBe('title');
    });

    it('should return null', async () => {
      const book = await service.findById('2');
      expect(book).toBeNull();
    });
  });

  describe('insert', () => {
    it('should insert a book', async () => {
      const book = await service.insert({
        title: 'title',
        authors: 'author',
        description: 'description',
        favorite: true,
      });
      expect(book).toBeInstanceOf(BookDto);
      expect(book.title).toBe('title');
    });
  });

  describe('replace', () => {
    it('should replace a book', async () => {
      const book = await service.replace('1', {
        title: 'title',
        authors: 'author',
        description: 'description',
        favorite: true,
      });
      expect(book).toBeInstanceOf(BookDto);
      expect(book.title).toBe('title');
    });
  });

  describe('delete', () => {
    it('should delete a book', async () => {
      const book = await service.delete('1');
      expect(book).toBeInstanceOf(BookDto);
      expect(book.title).toBe('title');
    });
  });
});
