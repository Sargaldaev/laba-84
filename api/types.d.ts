import user from './models/User';

export interface UserFields {
  username: string;
  password: string;
  token: string;
}

export interface Tasks {
  user: user;
  title: string;
  description: string | null;
  status: 'new' | 'in_progress' | 'complete';
}
