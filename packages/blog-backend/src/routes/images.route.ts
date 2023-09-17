import { Router } from 'express';
import { Route } from '../types/routes.type';
import { ImageController } from '../controllers';
import authMiddleware from '../middlewares/auth.middleware';

class CategoryRoute implements Route {
  public path = '/api/images';

  public router = Router();

  public imageController = new ImageController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      authMiddleware,
      this.imageController.getImages
    );
  }
}

export default CategoryRoute;
