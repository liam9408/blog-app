import { User } from './user.type.js';
import { Category } from './category.type.js';

export interface Post {
  id: number;
  userId?: number;
  title?: string;
  content?: string;
  categoryId?: number;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  category: Category;
}
