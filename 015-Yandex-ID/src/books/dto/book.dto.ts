export class BookDto {
  id: string;
  title: string;
  description: string;
  authors: string;
  favorite: boolean;
  fileCover?: string;
  fileName?: string;
  fileBook?: string;

  constructor(partial: Partial<BookDto>) {
    this.id = partial.id;
    this.title = partial.title;
    this.description = partial.description;
    this.authors = partial.authors;
    this.favorite = partial.favorite;
    this.fileCover = partial.fileCover;
    this.fileName = partial.fileName;
    this.fileBook = partial.fileBook;
  }
}

export type CreateBookDto = Omit<BookDto, "id">;
export type UpdateBookDto = Omit<BookDto, "id">;
export type ReplaceBookDto = Partial<Omit<BookDto, "id">>;