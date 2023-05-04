'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert('emails', [
    {
      id: 7,
      slug: "application-assigend-mentor",
      subject: "Utside - New Student Application Assigned",
      template:`Dear <%= username %>, \n
                Application of <%= applicantName %> has been assigned.
                Kindly evaluate. \n
                Regards,
                Team UtSide`,
      placeHolders: "username, applicantName",
      createdBy: 1
    }],{
      updateOnDuplicate:["subject", "template", "placeHolders"]
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('emails', null, {});
  }
};
