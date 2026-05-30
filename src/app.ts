import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/users';
import cardRoutes from './routes/cards';

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req: Request, res: Response, next: NextFunction) => {
  (req as any).user = {
    _id: '6a1315110c9b26e4816e47ab',
  };

  next();
});
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.listen(PORT, () => {
  console.log('Hello world');
});
