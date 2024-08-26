import { Joi, Segments } from 'celebrate';

// User Validation

export const userValidationSchema = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required().messages({
      'string.base': '"email" должно быть строкой',
      'string.email': '"email" должно быть действительным адресом электронной почты',
      'string.empty': '"email" не может быть пустым',
      'any.required': '"email" обязательно для заполнения',
    }),
    password: Joi.string().min(6).required().messages({
      'string.base': '"password" должно быть строкой',
      'string.min': '"password" должно быть не менее 6 символов',
      'string.empty': '"password" не может быть пустым',
      'any.required': '"password" обязательно для заполнения',
    }),
    name: Joi.string().min(2).max(30).optional()
      .messages({
        'string.base': '"name" должно быть строкой',
        'string.min': '"name" должно быть не менее 2 символов',
        'string.max': '"name" должно быть не более 30 символов',
        'string.empty': '"name" не может быть пустым',
      }),
    about: Joi.string().min(2).max(30).optional()
      .messages({
        'string.base': '"about" должно быть строкой',
        'string.min': '"about" должно быть не менее 2 символов',
        'string.max': '"about" должно быть не более 30 символов',
        'string.empty': '"about" не может быть пустым',
      }),
  }),
};

export const userIdValidation = {
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().hex().required().length(24),
  }),
};

export const updateUserValidation = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(200).required(),
  }),
};

export const updateAvatarValidation = {
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().uri().required(),
  }),
};

// Card Validation

export const createCardValidation = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri(),
  }),
};

export const cardIdValidation = {
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
};
