import { injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import _ from 'lodash';

import { SERVICE_IDENTIFIER } from '../constants';
import iocContainer from '../configs/ioc.config';

import { AuthService } from '../services';
import logger from '../utils/logger';
import { RegistrationData } from '../types/auth.type';
import { RequestWithIdentity } from 'request.type';

@injectable()
class AuthController {
  public authService = iocContainer.get<AuthService>(
    SERVICE_IDENTIFIER.AUTH_SERVICE
  );

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, email, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);
      const registrationdata: RegistrationData = {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      };

      const { cookie, user } =
        await this.authService.register(registrationdata);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      logger.log({
        level: 'error',
        label: 'Auth Controller',
        message: `Unable to register user`,
      });
      next(error);
    }
  };

  public authorize = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, password } = req.body;
      const { cookie, user } = await this.authService.authorize(
        email,
        password
      );

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      logger.log({
        level: 'error',
        label: 'Auth Controller',
        message: `Unable to authorize user`,
      });
      next(error);
    }
  };

  public reAuthorize = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req;

      const { cookie, user } = await this.authService.reAuthorize(userId);

      // todo: check cookie exp
      if (cookie) {
        res.setHeader('Set-Cookie', [cookie]);
      }
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      logger.log({
        level: 'error',
        label: 'Auth Controller',
        message: `Unable to reauthorize user`,
      });
      next(error);
    }
  };

  public logout = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.setHeader('Set-Cookie', [
        `Authorization=; Path=/; Max-age=0; Domain=${process.env.MAIN_DOMAIN}`,
      ]);
      res.clearCookie('Authorization');

      res.status(200).json({
        success: true,
      });
    } catch (error) {
      logger.log({
        level: 'error',
        label: 'Auth Controller',
        message: `Unable to logout user`,
      });
      next(error);
    }
  };
}

export default AuthController;
