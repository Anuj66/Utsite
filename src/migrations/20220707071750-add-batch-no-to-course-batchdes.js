'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('course_batches', 'batchNo', {
      type: Sequelize.STRING(100),
      after:'id'
    })

    await queryInterface.changeColumn('course_batches', 'endDate', {
      type: Sequelize.STRING(100),
      allowNull: true
    }),

    await queryInterface.changeColumn('course_batches', 'deletedBy', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0
    })
    
    await queryInterface.changeColumn('course_batches', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null
    })
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('course_batches', 'batchNo', {})
  }
};
