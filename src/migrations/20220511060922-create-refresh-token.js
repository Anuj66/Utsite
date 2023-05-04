'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('refresh_tokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: { 
        type: Sequelize.INTEGER,
        forignKey:{ model: 'users', key: 'id'}
      },
      token: { type: Sequelize.STRING },
      revokedAt: { type: Sequelize.DATE },
      revokedByIp: { type: Sequelize.STRING },
      replacedByToken: { type: Sequelize.STRING },
      createdByIp: { type: Sequelize.STRING },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      expires: { type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('refresh_tokens');
  }
};