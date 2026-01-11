
import Joi from 'joi';

export const weatherByCitySchema = Joi.string()
    .pattern(/^[a-zA-ZæøåÆØÅ\s-]+$/)
    .min(2)
    .max(5)
    .required();
