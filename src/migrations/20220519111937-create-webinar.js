'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('webinars', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      webinarNo:{
        type: Sequelize.STRING(100)
      }
      ,fullname: {
        type: Sequelize.STRING(100)
      },
      email: {
        type: Sequelize.STRING(200)
      },
      mobileNo: {
        type: Sequelize.STRING(100)
      },
      city: {
        type: Sequelize.STRING(100)
      },
      areaOfIntrerest: {
        type: Sequelize.STRING(100)
      },
      webinarSlots: {
        type: Sequelize.STRING(200)
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
    },{
      uniqueKeys: {
        webinarNo_unique: {
          fields: ['webinarNo']
        },
        email_unique: {
          fields: ['email']
        },
        mobile_unique: {
          fields: ['mobileNo']
        },
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('webinars');
  }
};