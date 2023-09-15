import { injectable } from 'inversify';
import { FindOptions, Transaction } from 'sequelize';

import PostModel from '../db/models/post.model';
import UserModel from '../db/models/user.model';
import CategoryModel from '../db/models/category.model';
import HttpException from '../exceptions/HttpException';
import logger from '../utils/logger';
import { Post } from '../types/posts.type';
import Category from '../db/models/category.model';

@injectable()
class PostService {
  public postModel = PostModel;

  public userModel = UserModel;

  public categoryModel = CategoryModel;

  public async findAndCountAll(
    query?: FindOptions
  ): Promise<{ rows: Post[]; count: number }> {
    try {
      const records = await this.postModel.findAndCountAll({
        ...query,
        attributes: { exclude: ['content'] },
        include: [
          { model: this.userModel, attributes: { exclude: ['password'] } },
          { model: this.categoryModel },
        ],
      });
      const resp = {
        ...records,
        rows: records.rows.map((row: any) => row.toJSON() as Post),
      };
      return resp;
    } catch (error) {
      logger.error({
        level: 'error',
        label: 'Post Service - findAndCountAll',
        message: error.stack,
      });
      throw new HttpException(500, 30001, 'Unable to find and count all posts');
    }
  }

  public async findAll(query?: FindOptions): Promise<Post[]> {
    try {
      const records = await this.postModel.findAll({
        ...query,
        include: [
          { model: this.userModel, attributes: { exclude: ['password'] } },
          { model: this.categoryModel },
        ],
      });
      return records.map((row: any) => row.toJSON() as Post);
    } catch (error) {
      logger.error({
        level: 'error',
        label: 'Post Service - findAll',
        message: error.stack,
      });
      throw new HttpException(500, 30001, 'Unable to find all posts');
    }
  }

  public async getPostById(
    postId: number,
    options?: FindOptions
  ): Promise<Post> {
    try {
      console.log(typeof postId);
      const record = await this.postModel.findByPk(postId, {
        ...options,
        include: [
          { model: this.userModel, attributes: { exclude: ['password'] } },
          { model: this.categoryModel },
        ],
      });
      return record.toJSON();
    } catch (error) {
      logger.error({
        level: 'error',
        label: 'Post Service - getPostById',
        message: error.stack,
      });
      throw new HttpException(500, 30001, 'Unable to find get post');
    }
  }

  public async createPost(
    dataToCreate: Post,
    transaction?: Transaction
  ): Promise<Post> {
    try {
      const newPost = await this.postModel.create(
        { ...dataToCreate },
        {
          transaction,
        }
      );
      return newPost.toJSON();
    } catch (error) {
      console.log(error);
      logger.error({
        level: 'error',
        label: 'Post Service - editPost',
        message: error.stack,
      });
      throw new HttpException(500, 30006, 'Unable to create post');
    }
  }

  public async editPost(
    dataToUpdate: Post,
    postIds: number[],
    transaction?: Transaction
  ): Promise<{ count: number; data?: Post[] }> {
    try {
      const [count] = await this.postModel.update(
        { ...dataToUpdate },
        {
          where: {
            id: postIds,
          },
          transaction,
        }
      );
      return { count };
    } catch (error) {
      logger.error({
        level: 'error',
        label: 'Post Service - editPost',
        message: error.stack,
      });
      throw new HttpException(500, 30006, 'Unable to edit posts');
    }
  }

  public async delete(
    postIds: number[],
    transaction?: Transaction
  ): Promise<{ count: number }> {
    try {
      const count = await this.postModel.destroy({
        where: {
          id: postIds,
        },
        transaction,
      });
      return { count };
    } catch (error) {
      logger.error({
        level: 'error',
        label: 'Post Service - findAll',
        message: error.stack,
      });
      throw new HttpException(500, 30006, 'Unable to delete posts');
    }
  }
}

export default PostService;
