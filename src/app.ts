import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/users';
import cardRoutes from './routes/cards';
import { createUser, login } from './controllers/users';
import { auth } from './middlewares/auth';
import { validateSignup, validateSignin } from './middlewares/validators';
import { requestLogger, errorLogger } from './middlewares/logger';

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.post('/signup', validateSignup, createUser);
app.post('/signin', validateSignin, login);

app.use('/users', auth);
app.use('/cards', cardRoutes);

app.use(requestLogger);
app.use(errorLogger);


app.listen(PORT, () => {
  console.log('Hello world');
});


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({ message: 'На сервере произошла ошибка' });
});