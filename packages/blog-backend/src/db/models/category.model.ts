import { Sequelize, Model, DataTypes } from 'sequelize';

import Post from './post.model';

class Category extends Model {
  public id!: number;

  public name: string;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): void {
    Category.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: new DataTypes.TEXT(),
        },
      },
      {
        sequelize,
        modelName: 'categories',
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
    this.hasMany(Post);
  }
}

export default Category;
