import express from 'express';
import auth, {RequestWithUser} from '../middleware/auth';
import {Error} from 'mongoose';
import Task from '../models/Task';

const tasksRouter = express.Router();


tasksRouter.post('/', auth, async (req, res, next) => {

  const user = (req as RequestWithUser).user;

  try {
    const task = {
      user: user._id,
      title: req.body.title,
      description: req.body.description,
      status: req.body.status
    };

    const saveTask = new Task(task);
    await saveTask.save();

    return res.send(saveTask);
    // todo надо доделать проверки на валидации

  } catch (error) {
    if (error instanceof Error.ValidationError) {
      return res.status(422).send(error);
    }
    return next(error);
  }

});

tasksRouter.get('/', auth, async (req, res, next) => {

  const user = (req as RequestWithUser).user;

  try {
    const tasks = await Task.find({user});

    return res.send(tasks);

  } catch (error) {
    return res.send(error);
  }

});
export default tasksRouter;