import { Post } from './posts.type';

export interface User {
  id?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
  posts?: Post[];
}

export interface CreateUserPayload {
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
}
