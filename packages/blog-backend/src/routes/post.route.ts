import { Router } from 'express';
import { Route } from '../types/routes.type';
import { PostController } from '../controllers';
import authMiddleware from '../middlewares/auth.middleware';
import validationMiddleware from '../middlewares/validation.middleware';
import { EditPostDto } from '../dtos/post';

class CategoryRoute implements Route {
  public path = '/api/posts';

  public router = Router();

  public postController = new PostController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      authMiddleware,
      this.postController.getPosts
    );

    this.router.get(
      `${this.path}/:postId`,
      authMiddleware,
      this.postController.getPost
    );

    this.router.post(
      `${this.path}/new`,
      validationMiddleware(EditPostDto),
      authMiddleware,
      this.postController.createPost
    );

    this.router.put(
      `${this.path}/:postId`,
      validationMiddleware(EditPostDto),
      authMiddleware,
      this.postController.editPost
    );

    this.router.delete(
      `${this.path}/:postId`,
      authMiddleware,
      this.postController.deletePost
    );
  }
}

export default CategoryRoute;
