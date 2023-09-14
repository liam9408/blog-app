import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import UserModel from '../db/models/user.model';
import HttpException from '../exceptions/HttpException';
import { RequestWithIdentity } from '../types/request.type';
import { DataStoredInToken } from '../types/auth.type';

async function authMiddleware(
  req: RequestWithIdentity,
  res: Response,
  next: NextFunction
) {
  try {
    const { cookies } = req;
    if (cookies.Authorization) {
      try {
        const { Authorization } = cookies;
        const secret = process.env.JWT_SECRET;

        const verificationResponse = jwt.verify(
          Authorization,
          secret
        ) as DataStoredInToken;

        const { userId } = verificationResponse;
        const user = await UserModel.findByPk(userId);

        if (!user) {
          next(new HttpException(403, 20001, 'Invalid or expired token'));
        }

        req.userId = userId;

        next();
      } catch (err) {
        res.clearCookie('Authorization');
        next(new HttpException(403, 20001, err.message));
      }
    } else {
      res.clearCookie('Authorization');
      next(new HttpException(403, 20003, 'No Authentication Tokens Found'));
    }
  } catch (e) {
    next(e);
  }
}

export default authMiddleware;
