import { injectable } from 'inversify';
import { FindOptions } from 'sequelize';

import CategoryModel from '../db/models/category.model';
import HttpException from '../exceptions/HttpException';
import logger from '../utils/logger';
import { Category } from 'category.type';

@injectable()
class CategoryService {
  public categoryModel = CategoryModel;

  public async findAll(query?: FindOptions): Promise<Category[]> {
    try {
      const records = await this.categoryModel.findAll(query);
      return records.map((row: any) => row.toJSON() as Category);
    } catch (error) {
      logger.error({
        level: 'error',
        label: 'Category Service - findAll',
        message: error.stack,
      });
      throw new HttpException(500, 30001, 'Unable to find all categories');
    }
  }
}

export default CategoryService;
