import 'reflect-metadata';
import * as jwt from 'jsonwebtoken';
import { SERVICE_IDENTIFIER } from '../constants';
import AuthService from './auth.service';
import iocTestContainer from '../tests/configs/jest.ioc.config';
import { User } from '../types/user.type';
import UserModel from '../db/models/user.model';

const token = 'token';
const expiresIn = 1200;
const user = { id: 1, firstName: 'test', lastName: 'test' } as User;
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
      expect(() =>
        authService.createToken(mockedDataStoredInToken)
      ).toThrowError(expect.any(Error));
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
      expect(res).toEqual(
        `Authorization=${token}; HttpOnly; Path=/; Max-Age=${expiresIn};`
      );
    });
  });

  //   describe('findIdentity', () => {
  //     it('finds identity', async () => {
  //       expect.assertions(3);
  //       const modelInstanceMock = {
  //         toJSON: jest.fn(() => {
  //           return user;
  //         }),
  //       };
  //       jest
  //         .spyOn(mockedUserModel, 'findOne')
  //         .mockResolvedValueOnce(modelInstanceMock);
  //       const res = await authService.findIdentity(token);
  //       expect(authService.identityModel.findOne).toHaveBeenCalledTimes(1);
  //       expect(modelInstanceMock.toJSON).toBeCalledTimes(1);
  //       expect(res).toMatchObject(identity);
  //     });
  //     it('cannot find identity', async () => {
  //       expect.assertions(1);
  //       jest.spyOn(mockedUserModel, 'findOne').mockImplementation(async () => {
  //         throw new Error();
  //       });
  //       return authService
  //         .findIdentity(token)
  //         .catch((e) => expect(e).toEqual(expect.any(Error)));
  //     });
  //   });

  //   describe('authorize', () => {
  //     it('authorizes', async () => {
  //       expect.assertions(2);
  //       const params = { token };
  //       jest
  //         .spyOn(AuthService.prototype, 'findIdentity')
  //         .mockImplementation(async () => {
  //           return identity;
  //         });
  //       jest
  //         .spyOn(AuthService.prototype, 'createJwtToken')
  //         .mockImplementation(() => {
  //           return {
  //             token,
  //             expiresIn,
  //           };
  //         });
  //       const mockedCreateCookie = jest.fn().mockReturnValue('cookie');
  //       AuthService.createCookie = mockedCreateCookie;
  //       const res = await authService.authorize(params);
  //       expect(authService.createJwtToken).toHaveBeenCalledTimes(1);
  //       expect(res).toEqual({ cookie: 'cookie', identity });
  //     });
  //     it('cannot authorize identity', async () => {
  //       expect.assertions(1);
  //       const params = { token };
  //       jest
  //         .spyOn(AuthService.prototype, 'findIdentity')
  //         .mockImplementation(async () => {
  //           throw new Error();
  //         });
  //       return authService
  //         .authorize(params)
  //         .catch((e) => expect(e).toEqual(expect.any(Error)));
  //     });
  //   });

  //   describe('reAuthorize', () => {
  //     it('authorizes', async () => {
  //       expect.assertions(2);
  //       const params = { token };
  //       jest
  //         .spyOn(AuthService.prototype, 'findIdentity')
  //         .mockImplementation(async () => {
  //           return identity;
  //         });
  //       jest
  //         .spyOn(AuthService.prototype, 'createJwtToken')
  //         .mockImplementation(() => {
  //           return {
  //             token,
  //             expiresIn,
  //           };
  //         });
  //       const mockedCreateCookie = jest.fn().mockReturnValue('cookie');
  //       AuthService.createCookie = mockedCreateCookie;
  //       const res = await authService.reAuthorize(params);
  //       expect(authService.createJwtToken).not.toHaveBeenCalled();
  //       expect(res).toEqual({ identity });
  //     });
  //     it('cannot authorize identity', async () => {
  //       expect.assertions(1);
  //       const params = { token };
  //       jest
  //         .spyOn(AuthService.prototype, 'findIdentity')
  //         .mockImplementation(async () => {
  //           throw new Error();
  //         });
  //       return authService
  //         .reAuthorize(params)
  //         .catch((e) => expect(e).toEqual(expect.any(Error)));
  //     });
  //   });
});
