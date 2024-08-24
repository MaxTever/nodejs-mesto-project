import express from 'express';
import mongoose from 'mongoose';

const app = express();

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));