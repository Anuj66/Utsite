'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class mentorDemoreels extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  mentorDemoreels.init({
    userId: {
      type: DataTypes.INTEGER,
      references:{ model: 'Users', "key": 'id'}
    },
    reelType: DataTypes.ENUM('Vimeo', 'Youtube', 'Artstation', 'Other'),
    reelUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'mentorDemoreels',
    tableName: "mentor_demoreels"
  });
  return mentorDemoreels;
};