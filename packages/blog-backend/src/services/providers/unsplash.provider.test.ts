import 'reflect-metadata';
import { SERVICE_IDENTIFIER } from '../../constants';
import UnsplashProvider from './unsplash.provider';
import iocTestContainer from '../../tests/configs/jest.ioc.config';

describe('Unit Test: Unsplash Provider', () => {
  let unsplashProvider: UnsplashProvider;

  beforeAll(() => {
    unsplashProvider = iocTestContainer.get<UnsplashProvider>(
      SERVICE_IDENTIFIER.UNSPLASH_PROVIDER
    );
  });

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('getImages', () => {
    it('success', async () => {
      jest.spyOn(unsplashProvider, 'getImages').mockImplementation(async () => {
        return [
          {
            urls: {
              thumbnail: '',
              image: '',
            },
          },
        ];
      });

      const res = await unsplashProvider.getImages();
      expect(res).not.toBeNull();
    });

    it('error', async () => {
      return unsplashProvider
        .getImages()
        .catch((e) => expect(e).toEqual(expect.any(Error)));
    });
  });
});
