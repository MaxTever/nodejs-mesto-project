import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import {login, createUser } from './controllers/users'
import auth from './middlewares/auth';

const { PORT, DB_PATH } = process.env;

const app = express();

mongoose.connect(`${DB_PATH}`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signup', createUser);
app.post('/signin', login);


app.use(auth);


app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
