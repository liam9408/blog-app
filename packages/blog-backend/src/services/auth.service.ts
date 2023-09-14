import { injectable, inject } from 'inversify';
import { Transaction } from 'sequelize';
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import ServerConfig from '../configs/server.config';
import { SERVICE_IDENTIFIER } from '../constants';

import UserModel from '../db/models/user.model';
import HttpException from '../exceptions/HttpException';
import logger from '../utils/logger';
import { User } from '../types/user.type';
import { RegistrationData } from '../types/auth.type';
import { TokenData, DataStoredInToken } from '../types/auth.type';

@injectable()
class AuthService {
  private serverConfig: ServerConfig;

  public userModel = UserModel;

  constructor(
    @inject(SERVICE_IDENTIFIER.SERVER_CONFIG) serverConfig: ServerConfig
  ) {
    this.serverConfig = serverConfig;
  }

  public async register(
    registrationData: RegistrationData,
    transaction?: Transaction
  ): Promise<{ cookie: string; user: User }> {
    try {
      const newUser = await this.userModel.create(
        { ...registrationData },
        { transaction }
      );

      delete newUser.password;

      const tokenData = this.createJwtToken({ userId: newUser.id });
      const cookie = AuthService.createCookie(tokenData);
      return {
        cookie,
        user: newUser.toJSON(),
      };
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Auth Service - register',
        message: err.stack,
      });
      throw new HttpException(500, 30001, 'Unable to register user');
    }
  }

  public async authorize(
    email: string,
    password: string
  ): Promise<{ cookie: string; user: User }> {
    try {
      const existingUser = await this.userModel.findOne({
        where: {
          email,
        },
      });
      if (existingUser) {
        throw new HttpException(500, 30001, 'No user found');
      }

      const isPasswordMatching: boolean = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!isPasswordMatching) {
        throw new HttpException(409, 30001, 'Invalid credentials.');
      }

      delete existingUser.password;

      const tokenData = this.createJwtToken({ userId: existingUser.id });
      const cookie = AuthService.createCookie(tokenData);
      return {
        cookie,
        user: existingUser.toJSON(),
      };
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Auth Service - authorize',
        message: err.stack,
      });
      throw new HttpException(500, 30001, 'Unable to register user');
    }
  }

  public async reAuthorize(
    userId: number
  ): Promise<{ cookie: string; user: User }> {
    try {
      const existingUser = await this.userModel.findByPk(userId);

      if (existingUser) {
        throw new HttpException(500, 30001, 'No user found');
      }

      delete existingUser.password;

      const tokenData = this.createJwtToken({ userId: existingUser.id });
      const cookie = AuthService.createCookie(tokenData);
      return {
        cookie,
        user: existingUser.toJSON(),
      };
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Auth Service - authorize',
        message: err.stack,
      });
      throw new HttpException(500, 30001, 'Unable to register user');
    }
  }

  public async signOut(data: User, transaction: Transaction): Promise<User> {
    try {
      const newUser = await this.userModel.create({ ...data }, { transaction });
      return newUser.toJSON();
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Auth Service',
        message: err.stack,
      });
      throw new HttpException(500, 30001, 'Unable to register user');
    }
  }

  public createJwtToken(DataStoredInToken: DataStoredInToken): TokenData {
    // eslint-disable-next-line camelcase
    const { jwtSecret } = this.serverConfig;
    const expiresIn: number = 60 * 20;
    const token = jwt.sign(DataStoredInToken, jwtSecret, { expiresIn });
    if (!token) {
      logger.log({
        level: 'error',
        label: 'Auth Service',
        message: 'Unable to create security token',
      });
      throw new HttpException(500, 30006, 'Unable to create security token');
    }
    return {
      expiresIn,
      token,
    };
  }

  public static createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Path=/; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
