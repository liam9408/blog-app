import { Sequelize, Model, DataTypes } from 'sequelize';

import User from './user.model';
import Category from './category.model';

class Post extends Model {
  public id!: number;

  public userId: number;

  public title: string;

  public content: string;

  public categoryId: number;

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
          type: new DataTypes.TEXT(),
        },
        content: {
          type: new DataTypes.TEXT(),
        },
        status: {
          type: new DataTypes.STRING(255),
        },
        categoryId: {
          type: DataTypes.INTEGER,
          references: {
            model: Category,
            key: 'id',
          },
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
