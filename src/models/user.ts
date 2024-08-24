import { Schema, model } from 'mongoose';
import validator from 'validator';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
}

export const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => validator.isURL(v),
      message: 'Некорректный URL',
    },
  },
});

export default model<IUser>('user', userSchema);
