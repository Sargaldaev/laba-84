import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './config';
import usersRouter from './routers/users';

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());
app.use('/users', usersRouter);


const run = async () => {

  await mongoose.connect(config.db);

  app.listen(port, () => {
    console.log(`server started on ${port} port`);
  });

  process.on('exit', () => {
    mongoose.disconnect();
  });
};

run().catch(e => console.error(e));