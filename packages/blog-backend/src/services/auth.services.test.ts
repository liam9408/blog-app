import 'reflect-metadata';
import * as jwt from 'jsonwebtoken';
import { RegistrationData } from 'auth.type';
import { SERVICE_IDENTIFIER } from '../constants';
import AuthService from './auth.service';
import iocTestContainer from '../tests/configs/jest.ioc.config';
import { User } from '../types/user.type';
import UserModel from '../db/models/user.model';

const token = 'token';
const expiresIn = 86400;
const cookie = `Authorization=${token}; HttpOnly; Path=/; Max-Age=${expiresIn};`;
const user = {
  id: 1,
  firstName: 'test',
  lastName: 'test',
  email: 'test@test.com',
  password: 'test-password',
} as User;
const registrationData = {
  firstName: 'test',
  lastName: 'test',
  email: 'test@test.com',
  password: 'test-password',
} as RegistrationData;
const mockedDataStoredInToken = { userId: user.id };
const mockedUserModel = UserModel as jest.Mocked<any>;

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => {
    return token;
  }),
}));

describe('Unit Test: Auth Service', () => {
  let authService: AuthService;
  beforeAll(async () => {
    authService = iocTestContainer.get<AuthService>(
      SERVICE_IDENTIFIER.AUTH_SERVICE
    );
  });
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('create token', () => {
    it('creates jwt token', () => {
      expect.assertions(2);
      const res = authService.createToken(mockedDataStoredInToken);
      expect(jwt.sign).toHaveBeenCalledTimes(1);
      expect(res).toMatchObject({
        expiresIn,
        token,
      });
    });
    it('cannot sign jwt', () => {
      expect.assertions(1);
      jest.spyOn(jwt, 'sign').mockImplementation(() => {
        return undefined;
      });
      expect(() => authService.createToken(mockedDataStoredInToken)).toThrow(
        expect.any(Error)
      );
    });
  });

  describe('createCookie', () => {
    it('returns string', () => {
      expect.assertions(1);
      const tokenData = {
        token,
        expiresIn,
      };
      const res = AuthService.createCookie(tokenData);
      expect(res).toEqual(cookie);
    });
  });

  describe('register', () => {
    it('register', async () => {
      expect.assertions(1);
      jest
        .spyOn(AuthService.prototype, 'register')
        .mockImplementation(async () => {
          return { cookie, user };
        });
      jest
        .spyOn(AuthService.prototype, 'createToken')
        .mockImplementation(() => {
          return {
            token,
            expiresIn,
          };
        });
      const mockedCreateCookie = jest.fn().mockReturnValue('cookie');
      AuthService.createCookie = mockedCreateCookie;
      const res = await authService.register(registrationData);
      expect(res).toEqual({ cookie, user });
    });
    it('cannot register', async () => {
      expect.assertions(1);
      jest
        .spyOn(AuthService.prototype, 'register')
        .mockImplementation(async () => {
          throw new Error();
        });
      return authService
        .register(registrationData)
        .catch((e) => expect(e).toEqual(expect.any(Error)));
    });
  });

  describe('authorize', () => {
    it('authorizes', async () => {
      expect.assertions(1);
      jest
        .spyOn(AuthService.prototype, 'authorize')
        .mockImplementation(async () => {
          return { cookie, user };
        });
      jest
        .spyOn(AuthService.prototype, 'createToken')
        .mockImplementation(() => {
          return {
            token,
            expiresIn,
          };
        });
      const mockedCreateCookie = jest.fn().mockReturnValue('cookie');
      AuthService.createCookie = mockedCreateCookie;
      const res = await authService.authorize(user.email, user.password);
      expect(res).toEqual({ cookie, user });
    });
    it('cannot authorize', async () => {
      expect.assertions(1);
      jest
        .spyOn(AuthService.prototype, 'authorize')
        .mockImplementation(async () => {
          throw new Error();
        });
      return authService
        .authorize(user.email, user.password)
        .catch((e) => expect(e).toEqual(expect.any(Error)));
    });
  });

  describe('reAuthorize', () => {
    it('authorizes', async () => {
      expect.assertions(2);
      jest
        .spyOn(AuthService.prototype, 'reAuthorize')
        .mockImplementation(async () => {
          return { cookie, user };
        });
      jest
        .spyOn(AuthService.prototype, 'createToken')
        .mockImplementation(() => {
          return {
            token,
            expiresIn,
          };
        });
      const mockedCreateCookie = jest.fn().mockReturnValue('cookie');
      AuthService.createCookie = mockedCreateCookie;
      const res = await authService.reAuthorize(user.id);
      expect(authService.createToken).not.toHaveBeenCalled();
      expect(res).toEqual({ cookie, user });
    });
    it('cannot reAuthorize', async () => {
      expect.assertions(1);
      jest
        .spyOn(AuthService.prototype, 'reAuthorize')
        .mockImplementation(async () => {
          throw new Error();
        });
      return authService
        .reAuthorize(user.id)
        .catch((e) => expect(e).toEqual(expect.any(Error)));
    });
  });
});
