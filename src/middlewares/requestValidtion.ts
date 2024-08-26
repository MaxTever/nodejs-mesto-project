import { Request, Response, NextFunction } from 'express';
import joi from 'joi';
import { BAD_REQUEST_ERROR } from '../helpers/errors';

const urlSchema = joi
  .string()
  .regex(
    /^(http:\/\/|https:\/\/)(www\.)?([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=])?#?$/,
  )
  .required();

export const requestSchema = joi.object({
  app: urlSchema,
});

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { error } = requestSchema.validate(req.body);
  if (error) {
    return next(new BAD_REQUEST_ERROR(error.details[0].message));
  }
  next();
};
