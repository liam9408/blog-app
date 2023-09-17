import { User } from './user.type.js';
import { Category } from './category.type.js';

export interface Post {
  id?: number;
  userId?: number;
  title?: string;
  description?: string;
  content?: string;
  cover?: string;
  categoryId?: number;
  status?: 'draft' | 'published';
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  user?: User;
  category?: Category;
  readTimeMinutes?: number;
}
