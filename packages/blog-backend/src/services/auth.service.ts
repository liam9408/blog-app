import { injectable, inject } from 'inversify';
import { Transaction } from 'sequelize';
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { omit } from 'lodash';

import ServerConfig from '../configs/server.config';
import { SERVICE_IDENTIFIER } from '../constants';

import UserModel from '../db/models/user.model';
import HttpException from '../exceptions/HttpException';
import logger from '../utils/logger';
import { User } from '../types/user.type';
import { RegistrationData, TokenData } from '../types/auth.type';

@injectable()
class AuthService {
  private serverConfig: ServerConfig;

  public userModel = UserModel;

  constructor(
    @inject(SERVICE_IDENTIFIER.SERVER_CONFIG) serverConfig: ServerConfig
  ) {
    this.serverConfig = serverConfig;
  }

  private async createToken(userId: number): Promise<TokenData> {
    const { jwtSecret } = this.serverConfig;
    const expiresIn: number = 60 * 60 * 24;
    const token = jwt.sign({ userId }, jwtSecret, { expiresIn });

    if (!token) {
      logger.error({
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

  public async register(
    registrationData: RegistrationData,
    transaction?: Transaction
  ): Promise<{ cookie: string; user: User }> {
    try {
      const newUser = await this.userModel.create(
        { ...registrationData },
        {
          transaction,
        }
      );

      const tokenData = await this.createToken(newUser.id);
      const cookie = AuthService.createCookie(tokenData);

      const user = omit(newUser.toJSON(), 'password');

      return {
        cookie,
        user,
      };
    } catch (error) {
      logger.error({
        level: 'error',
        label: 'Auth Service - register',
        message: error.stack,
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
        where: { email },
      });

      if (!existingUser) {
        throw new HttpException(
          500,
          30001,
          `No user found with email ${email}`
        );
      }

      const isPasswordMatching: boolean = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!isPasswordMatching) {
        throw new HttpException(409, 30001, 'Invalid credentials.');
      }

      const tokenData = await this.createToken(existingUser.id);
      const cookie = AuthService.createCookie(tokenData);

      const user = omit(existingUser.toJSON(), 'password');

      return {
        cookie,
        user,
      };
    } catch (error) {
      logger.error({
        level: 'error',
        label: 'Auth Service - authorize',
        message: error.stack,
      });

      throw new HttpException(500, 30001, error.params);
    }
  }

  public async reAuthorize(
    userId: number
  ): Promise<{ cookie: string; user: User }> {
    try {
      const existingUser = await this.userModel.findByPk(userId);

      if (!existingUser) {
        throw new HttpException(500, 30001, 'No user found');
      }

      const tokenData = await this.createToken(userId);
      const cookie = AuthService.createCookie(tokenData);

      const user = omit(existingUser.toJSON(), 'password');

      return {
        cookie,
        user,
      };
    } catch (error) {
      logger.error({
        level: 'error',
        label: 'Auth Service - reAuthorize',
        message: error.stack,
      });

      throw new HttpException(500, 30001, 'Unable to reauthorize user');
    }
  }

  public async signOut(data: User, transaction: Transaction): Promise<User> {
    try {
      const newUser = await this.userModel.create({ ...data }, { transaction });

      return omit(newUser.toJSON(), 'password');
    } catch (error) {
      logger.error({
        level: 'error',
        label: 'Auth Service - signOut',
        message: error.stack,
      });

      throw new HttpException(500, 30001, 'Unable to sign out user');
    }
  }

  public static createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Path=/; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
