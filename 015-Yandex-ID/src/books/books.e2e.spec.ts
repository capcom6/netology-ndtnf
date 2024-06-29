import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { JwtGuard } from '../auth/jwt.guard';

describe('BooksController (e2e)', () => {
    let app: INestApplication;
    let booksService = {
        select: jest.fn(),
        findById: jest.fn().mockResolvedValue({ id: '65f835fe64de62befdc4af61', name: 'Book 1' }),
        insert: jest.fn(),
        replace: jest.fn().mockResolvedValue({ id: '65f835fe64de62befdc4af61', name: 'Book 1' }),
        delete: jest.fn(),
    };

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [BooksController],
            providers: [{
                provide: BooksService,
                useValue: booksService
            }],
        })
            .overrideGuard(JwtGuard)
            .useValue({ canActivate: () => true })
            .compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    it('/books (GET)', () => {
        return request(app.getHttpServer())
            .get('/books')
            .expect(200);
    });

    it('/books/:id (GET)', () => {
        return request(app.getHttpServer())
            .get('/books/65f835fe64de62befdc4af61')
            .expect(200);
    });

    it('/books/:id (GET) bad id', () => {
        return request(app.getHttpServer())
            .get('/books/1')
            .expect(400);
    });

    it('/books (POST)', () => {
        return request(app.getHttpServer())
            .post('/books')
            .send({ title: 'Book 2', description: 'Description', authors: 'Authors' })
            .expect(201);
    });

    it('/books (POST) w/o title', () => {
        return request(app.getHttpServer())
            .post('/books')
            .send({ description: 'Description', authors: 'Authors' })
            .expect(400);
    });

    it('/books/:id (PUT)', () => {
        return request(app.getHttpServer())
            .put('/books/65f835fe64de62befdc4af61')
            .send({ title: 'Book 2', description: 'Description', authors: 'Authors' })
            .expect(200);
    });

    it('/books/:id (DELETE)', () => {
        return request(app.getHttpServer())
            .delete('/books/65f835fe64de62befdc4af61')
            .expect(204);
    });

    afterAll(async () => {
        await app.close();
    });
});