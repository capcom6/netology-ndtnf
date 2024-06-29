export class BookCommentDto {
    id: string;
    bookId: string;
    text: string;

    constructor(partial: Partial<BookCommentDto>) {
        this.id = partial.id;
        this.bookId = partial.bookId;
        this.text = partial.text;
    }
}

export type CreateBookCommentDto = Omit<BookCommentDto, "id">;
