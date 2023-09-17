import { injectable } from 'inversify';
import { FindOptions } from 'sequelize';

import { Category } from 'category.type';
import CategoryModel from '../db/models/category.model';
import HttpException from '../exceptions/HttpException';
import logger from '../utils/logger';

@injectable()
class CategoryService {
  public categoryModel = CategoryModel;

  public async findAll(query?: FindOptions): Promise<Category[]> {
    try {
      const records = await this.categoryModel.findAll(query);
      return records.map((row: any) => row.toJSON() as Category);
    } catch (error) {
      console.log(error);
      logger.error({
        level: 'error',
        label: 'Category Service - findAll',
        message: error.stack,
      });
      throw new HttpException(500, 30006, 'Unable to find all categories');
    }
  }

  public async getCategoryByName(categoryName: string): Promise<Category> {
    try {
      const record = await this.categoryModel.findOne({
        where: {
          name: categoryName,
        },
      });
      return record.toJSON() as Category;
    } catch (error) {
      console.log(error);
      logger.error({
        level: 'error',
        label: 'Category Service - getCategory',
        message: error.stack,
      });
      throw new HttpException(500, 30006, 'Unable to find all categories');
    }
  }

  public async findById(categoryId: number): Promise<Category> {
    try {
      const record = await this.categoryModel.findByPk(categoryId);
      return record.toJSON() as Category;
    } catch (error) {
      console.log(error);
      logger.error({
        level: 'error',
        label: 'Category Service - findByPk',
        message: error.stack,
      });
      throw new HttpException(500, 30006, 'Unable to find all categories');
    }
  }
}

export default CategoryService;
