import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string, string> {
    /**
     * Validates the given value as a MongoDB ObjectId.
     *
     * @param {string} value - The string value to be validated.
     * @return {string} The validated MongoDB ObjectId.
     * @throws {BadRequestException} If the value is not a valid MongoDB ObjectId.
     */
    transform(value: string): string {
        if (!isValidObjectId(value)) {
            throw new BadRequestException('Invalid MongoDB ObjectId');
        }
        return value;
    }
}
