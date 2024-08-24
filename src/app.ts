import express from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
