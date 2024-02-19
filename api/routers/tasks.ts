import express from 'express';
import auth, {RequestWithUser} from '../middleware/auth';
import mongoose, {Error} from 'mongoose';
import Task from '../models/Task';
import User from '../models/User';

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

  } catch (error) {
    if (error instanceof Error.ValidationError) {
      return res.status(422).send(error);
    }
    return next(error);
  }

});

tasksRouter.put('/:id', auth, async (req, res, next) => {
  const _id = req.params.id;

  const user = (req as RequestWithUser).user;

  const updateTask = {
    title: req.body.title,
    description: req.body?.description,
    status: req.body?.status
  };

  try {

    const findTask = await Task.findById(_id);

    if (!findTask) {
      return res.status(404).send({error: 'Task is not found'});
    }

    if (findTask.user.toString() !== user._id.toString()) {
      return res.status(403).send({error: 'Restricted action!'});
    }

    await Task.updateOne({_id}, {$set: updateTask});

    await findTask.save();
    return res.send(updateTask);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    }

    return next(e);
  }
});

tasksRouter.delete('/:id', auth, async (req, res) => {

  const user = (req as RequestWithUser).user;
  const id = req.params.id;

  try {
    const taskByUser = await User.findOne({_id: user._id});
    const task = await Task.findOne({user: taskByUser});

    if (task) {
      const taskDelete = await Task.deleteOne({_id: id});
      if (taskDelete.deletedCount === 0) {
        return res.send('task not found');
      }
      return res.send(taskDelete);
    }

    return res.sendStatus(403);

  } catch (error) {
    return res.send(error);
  }

});


tasksRouter.get('/', auth, async (req, res) => {
  const user = (req as RequestWithUser).user;

  try {
    const tasks = await Task.find({user});
    return res.send(tasks);

  } catch (error) {
    return res.send(error);
  }

});


export default tasksRouter;