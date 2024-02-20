import mongoose from 'mongoose';
import crypto from 'crypto';
import config from './config';
import User from './models/User';
import Task from './models/Task';

const run = async () => {
  await mongoose.connect(config.db);
  const db = mongoose.connection;

  try {
    await db.dropCollection('tasks');
    await db.dropCollection('users');
  } catch (e) {
    console.log('Collections were not present, skipping drop...');
  }

  const [user, admin] = await User.create({
    username: 'user',
    password: '1qaz@WSX29',
    token: crypto.randomUUID(),
  }, {
    username: 'admin',
    password: '1qaz@WSX29',
    token: crypto.randomUUID(),
  });

  await Task.create({
    user: user._id,
    title: 'Sleep',
    status: 'new',
    description: '8 hours',
  }, {
    user: admin._id,
    title: 'Code',
    status: 'new',
    description: 'Do homework',
  }, {
    user: admin._id,
    title: 'Read book',
    status: 'in_progress',
    description: 'Read for 1 hour',
  }, {
    user: user._id,
    title: 'Relax',
    status: 'in_progress',
    description: 'Do nothing',
  }, {
    user: admin._id,
    title: 'Go to work',
    status: 'complete',
    description: 'To earn money',
  }, {
    user: user._id,
    title: 'Drink coffee',
    status: 'complete',
    description: 'Amazing'
  });

  await db.close();
};

run().catch(console.error);