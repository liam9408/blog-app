import { Router } from 'express';
import { Route } from '../types/routes.type';
import { AuthController } from '../controllers';
import authMiddleware from '../middlewares/auth.middleware';
import validationMiddleware from '../middlewares/validation.middleware';
import { AuthorizeDto, RegisterDto } from '../dtos/auth';

class DefaultRoute implements Route {
  public path = '/api/auth';

  public router = Router();

  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(RegisterDto),
      authMiddleware,
      this.authController.register
    );

    this.router.post(
      `${this.path}/signin`,
      validationMiddleware(AuthorizeDto),
      authMiddleware,
      this.authController.authorize
    );

    this.router.get(
      `${this.path}/reauth`,
      authMiddleware,
      this.authController.reAuthorize
    );

    this.router.get(
      `${this.path}/signout`,
      authMiddleware,
      this.authController.logout
    );
  }
}

export default DefaultRoute;
