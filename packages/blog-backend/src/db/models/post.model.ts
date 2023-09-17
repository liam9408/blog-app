import { Sequelize, Model, DataTypes } from 'sequelize';
import { values as getValues } from 'lodash';

import enums from '../../enums';
import User from './user.model';
import Category from './category.model';

const { status } = enums.POSTS;

class Post extends Model {
  public id!: number;

  public userId: number;

  public title: string;

  public description: string;

  public content: string;

  public categoryId: number;

  public publishedAt: Date;

  public cover: string;

  public readTimeMinutes: number;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): void {
    Post.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          references: {
            model: User,
            key: 'id',
          },
        },
        title: {
          type: new DataTypes.STRING(255),
        },
        description: {
          type: new DataTypes.TEXT(),
        },
        content: {
          type: new DataTypes.TEXT(),
        },
        status: {
          type: DataTypes.ENUM,
          values: getValues(status),
          defaultValue: status.DRAFT,
        },
        categoryId: {
          type: DataTypes.INTEGER,
          references: {
            model: Category,
            key: 'id',
          },
        },
        publishedAt: {
          type: DataTypes.DATE,
        },
        cover: {
          type: new DataTypes.STRING(255),
        },
        readTimeMinutes: {
          type: DataTypes.INTEGER,
        },
      },
      {
        sequelize,
        modelName: 'posts',
        paranoid: true,
        indexes: [
          {
            unique: true,
            fields: ['id'],
          },
        ],
      }
    );
  }

  public static initAssociation(): void {
    this.belongsTo(Category);
    this.belongsTo(User);
  }
}

export default Post;
