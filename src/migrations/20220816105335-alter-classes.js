'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn("classes", "status", {
      type: Sequelize.ENUM(
        "Scheduled",
        "Rescheduled"
      ),
      allowNull: false,
      defaultValue: 'Scheduled',
      after: 'endTime'
    });

    await queryInterface.addColumn("classes", "link", {
      type: Sequelize.TEXT,
      allowNull: true,
      after: "status",
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.removeColumn('classes', 'status')
     await queryInterface.removeColumn('classes', 'link')
  }
};
