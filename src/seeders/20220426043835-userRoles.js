'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     **/
    await queryInterface.bulkInsert('user_roles', [
      {
        id: 1,
        role:"Super Admin"
      },
      {
        id: 2,
        role:"Academics"
      },
      {
        id: 7,
        role:"Mentor"
      },
      {
        id: 12,
        role:"Enrollment"
      },
      {
        id: 3,
        role:"Campus Activity"
      },
      {
        id: 4,
        role:"Content"
      },
      {
        id: 5,
        role:"Placement"
      },
      {
        id: 9,
        role:"Student"
      }
    ], {});
    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     **/
    await queryInterface.bulkDelete('user_roles', null, {});
  }
};
