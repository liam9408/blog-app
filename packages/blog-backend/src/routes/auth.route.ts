import { Router } from 'express';
import { Route } from '../types/routes.type';
import { DefaultController } from '../controllers';

class DefaultRoute implements Route {
  public path = '/api/auth';

  public router = Router();

  public defaultController = new DefaultController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, async (req, res) => {
      res.status(200).json({ ok: true });
    });

    this.router.post(`${this.path}/signin`, async (req, res) => {
      res.status(200).json({ ok: true });
    });

    this.router.get(`${this.path}/signout`, async (req, res) => {
      res.status(200).json({ ok: true });
    });
  }
}

export default DefaultRoute;
