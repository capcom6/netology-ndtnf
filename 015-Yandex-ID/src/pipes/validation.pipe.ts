import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { ObjectSchema } from "joi";

export class ValidationPipe implements PipeTransform {
    constructor(
        private readonly schema: ObjectSchema
    ) { }

    transform(value: any, metadata: ArgumentMetadata) {
        const { error } = this.schema.validate(value);
        if (error) {
            throw new BadRequestException(
                error.message,
                { cause: error }
            );
        }
        return value;
    }

}