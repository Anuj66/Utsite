'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class communication extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.userRoles, {foreignKey: 'reciever' })
    }
  }
  communication.init({
    reciever: {
      type:DataTypes.INTEGER
    },
    message: DataTypes.STRING,
    isPublished: DataTypes.BOOLEAN,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
  }, {
    sequelize,
    tableName: 'communications',
    modelName: 'communication',
    timestamps: true
  });
  return communication;
};
