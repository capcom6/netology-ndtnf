import { MessageBody, SubscribeMessage, WebSocketGateway, WsResponse } from '@nestjs/websockets';
import { BookCommentsService } from './book-comments.service';

@WebSocketGateway()
export class BooksGateway {
  constructor(private readonly bookCommentsSvc: BookCommentsService) { }

  @SubscribeMessage('getAllComments')
  async getAllComments(@MessageBody('bookId') bookId: string): Promise<WsResponse<unknown>> {
    return {
      event: 'getAllCommentsRes',
      data: await this.bookCommentsSvc.findAllBookComments(bookId),
    };
  }

  @SubscribeMessage('addComment')
  async addComment(@MessageBody('text') text: string, @MessageBody('bookId') bookId: string): Promise<WsResponse<unknown>> {
    const created = await this.bookCommentsSvc.insert({
      bookId,
      text,
    });
    return {
      event: 'addCommentRes',
      data: created,
    };
  }
}
