import iocTestContainer, {
  setupSequelize,
} from '../tests/configs/jest.ioc.config';
import { SERVICE_IDENTIFIER } from '../constants';
import CategoryService from './categories.service';

import CategoryModel from '../db/models/category.model';

const mockedCategoryModel = CategoryModel as jest.Mocked<any>;

describe('Unit Test: Category Service', () => {
  let categoryService: CategoryService;

  beforeAll(async () => {
    await setupSequelize();

    categoryService = iocTestContainer.get<CategoryService>(
      SERVICE_IDENTIFIER.CATEGORY_SERVICE
    );
  });

  const category = {
    id: 1,
    name: 'Programming',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('findAll', () => {
    it('success', async () => {
      const categoryModelInstanceMock = {
        toJSON: jest.fn(() => category),
        map: jest.fn(() => [category]),
      };

      jest
        .spyOn(mockedCategoryModel, 'findAll')
        .mockResolvedValueOnce(categoryModelInstanceMock);

      const resp = await categoryService.findAll();
      expect(categoryService.categoryModel.findAll).toHaveBeenCalledTimes(1);
      expect(resp.length).toBeGreaterThanOrEqual(0);
    });

    it('error', async () => {
      expect.assertions(1);
      jest
        .spyOn(mockedCategoryModel, 'findAll')
        .mockImplementation(async () => {
          throw new Error();
        });
      return categoryService
        .findAll()
        .catch((e) => expect(e).toEqual(expect.any(Error)));
    });
  });

  describe('getCategoryByName', () => {
    it('success', async () => {
      const categoryModelInstanceMock = {
        toJSON: jest.fn(() => category),
      };

      jest
        .spyOn(mockedCategoryModel, 'findOne')
        .mockResolvedValueOnce(categoryModelInstanceMock);

      const resp = await categoryService.getCategoryByName(category.name);
      expect(categoryService.categoryModel.findOne).toHaveBeenCalled();
      expect(resp).not.toBeNull();
      expect(resp).toHaveProperty('id');
    });

    it('error', async () => {
      expect.assertions(1);
      jest
        .spyOn(mockedCategoryModel, 'findOne')
        .mockImplementation(async () => {
          throw new Error();
        });
      return categoryService
        .getCategoryByName(category.name)
        .catch((e) => expect(e).toEqual(expect.any(Error)));
    });
  });

  describe('findById', () => {
    it('success', async () => {
      const categoryModelInstanceMock = {
        toJSON: jest.fn(() => category),
      };

      jest
        .spyOn(mockedCategoryModel, 'findByPk')
        .mockResolvedValueOnce(categoryModelInstanceMock);

      const resp = await categoryService.findById(category.id);
      expect(categoryService.categoryModel.findOne).toHaveBeenCalled();
      expect(resp).not.toBeNull();
      expect(resp).toHaveProperty('id');
    });

    it('error', async () => {
      expect.assertions(1);
      jest
        .spyOn(mockedCategoryModel, 'findByPk')
        .mockImplementation(async () => {
          throw new Error();
        });
      return categoryService
        .findById(category.id)
        .catch((e) => expect(e).toEqual(expect.any(Error)));
    });
  });
});
