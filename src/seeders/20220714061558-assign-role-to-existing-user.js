'use strict';

const DB = require("../models")
const usersModel = DB.users

module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await usersModel.findAll({
      attributes: ['id', 'roleId']
    })
    const userRolesToAssing = users.map(user => {
      return {
        userId: user.id,
        roleId: user.roleId
      }
    })

    await queryInterface.bulkInsert('assigned_roles', userRolesToAssing, {})
  },

  async down (queryInterface, Sequelize) {
    
  }
};
