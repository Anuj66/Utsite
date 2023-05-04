'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.createTable('cities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      stateId: {
        type: Sequelize.INTEGER,
        references: { model: 'states', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      city: {
        type: Sequelize.STRING,
      }
    }).then(() => {
      queryInterface.addIndex(
        'cities',
        ['stateId', 'city'],
        {
          name: 'CityUnique',
          unique: true
        }
      );
    });;
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('cities');
  }
};