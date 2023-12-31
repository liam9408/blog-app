import { Router } from 'express';
import { Route } from '../types/routes.type';
import { CategoryController } from '../controllers';
import authMiddleware from '../middlewares/auth.middleware';

class CategoryRoute implements Route {
  public path = '/api/categories';

  public router = Router();

  public categoryController = new CategoryController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      authMiddleware,
      this.categoryController.getAllCategories
    );
  }
}

export default CategoryRoute;
