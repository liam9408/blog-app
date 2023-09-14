import { Router } from 'express';
import { Route } from '../types/routes.type';
import { CategoryController } from '../controllers';

class CategoryRoute implements Route {
  public path = '/api/categories';

  public router = Router();

  public categoryController = new CategoryController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.categoryController.getAllCategories);
  }
}

export default CategoryRoute;
