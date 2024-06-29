import * as Joi from "joi";

export const createBookSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    authors: Joi.string().required(),
    favorite: Joi.boolean(),
    fileCover: Joi.string(),
    fileName: Joi.string(),
    fileBook: Joi.string(),
});