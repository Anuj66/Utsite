'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contest_users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      contestUserNo:{
        type: Sequelize.STRING(10),
      },
      name: {
        type: Sequelize.STRING(100)
      },
      email: {
        type: Sequelize.STRING(200),
      },
      mobileNo: {
        type: Sequelize.STRING(10)
      },
      contest: {
        type: Sequelize.STRING(200),
      },
      resourceLink: {
        type: Sequelize.STRING
      },
      token:{
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM('Pending', 'Submitted')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        default:Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        default:Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    }, {
      uniqueKeys: {
        contestUserNo_unique: {
          fields: ['contestUserNo']
        },
        email_unique: {
            fields: ['email']
        },
        mobileNo_unique: {
          fields: ['mobileNo']
        },
        token_unique: {
          fields: ['token']
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('contest_users');
  }
};