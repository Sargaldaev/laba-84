import mongoose, {model, Schema} from 'mongoose';
import User from './User';
import {Tasks} from '../types';

const TaskSchema = new Schema<Tasks>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async (value: mongoose.Types.ObjectId) => await User.findById(value),
      message: 'User does not exist'
    }
  },
  title: {
    type: String,
    required: true
  },
  description: String,

  status: {
    type: String,
    required: true,
    enum: ['new', 'in_progress', 'complete'],
  }
});

const Task = model('Task', TaskSchema);
export default Task;
