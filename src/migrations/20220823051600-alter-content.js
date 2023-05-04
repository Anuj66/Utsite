'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.addColumn("contents", "batchId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: 'courseId'
    });

    await queryInterface.addConstraint("contents", {
      type: "foreign key",
      name: "contents_ibfk_1",
      fields: ["batchId"],
      references: {
        table: "course_batches",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.removeConstraint("contents", "contents_ibfk_1");
     await queryInterface.removeColumn('contents', 'batchId')
  }
};
