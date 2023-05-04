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
        id: 6,
        slug: "send-verification-otp",
        subject: "Utside - Verification Code",
        template:`Dear Student, \n
                  Your verification code is <%= OTPCode %>.
                  Please enter this code to verify your E-mail address \n
                  Thanks,
                  Team UtSide`,
        placeHolders: "OTPCode",
        createdBy: 1
      }
    ],{
      updateOnDuplicate:["subject", "template", "placeHolders"]
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('emails', {slug: "send-verification-otp"})
  }
};
