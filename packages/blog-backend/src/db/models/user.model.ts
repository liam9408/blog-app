import { Sequelize, Model, DataTypes } from 'sequelize';

import Post from './post.model';

class User extends Model {
  public id!: number;

  public email: string;

  public firstName: string;

  public lastName: string;

  public password: string;

  public avatar: string;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): void {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        email: {
          type: new DataTypes.STRING(255),
          allowNull: false,
          unique: true,
        },
        firstName: {
          type: new DataTypes.STRING(255),
        },
        lastName: {
          type: new DataTypes.STRING(255),
        },
        password: {
          type: new DataTypes.STRING(255),
        },
        avatar: {
          type: new DataTypes.STRING(255),
        },
      },
      {
        sequelize,
        modelName: 'users',
        indexes: [
          {
            unique: true,
            fields: ['id', 'email'],
          },
        ],
      }
    );
  }

  public static initAssociation(): void {
    this.hasMany(Post);
  }
}

export default User;
