import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { celebrate, errors } from 'celebrate';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import { login, createUser } from './controllers/users';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import { userValidationSchema } from './middlewares/validation';
import { errorHandler } from './middlewares/errorHandler';
import { NOT_FOUND_ERROR } from './helpers/errors';

const { PORT = 3000, DB_PATH = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

mongoose.connect(`${DB_PATH}`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.post('/signup', celebrate(userValidationSchema), createUser);
app.post('/signin', celebrate(userValidationSchema), login);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use('*', (req: Request, res: Response, next: NextFunction) => {
  next(new NOT_FOUND_ERROR('Ресурс не найден'));
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
