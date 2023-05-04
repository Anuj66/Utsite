'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.removeColumn('assignments', 'batchId');
    
    await queryInterface.addColumn("assignments", "description", {
      type: Sequelize.TEXT,
      after:"week",
      allowNull: true,
    });

    await queryInterface.addColumn("assignments", "attachment", {
      type: Sequelize.TEXT,
      after:"description",
      allowNull: true,
    });

    await queryInterface.addColumn("assignments", "order", {
      type: Sequelize.INTEGER,
      after:"attachment",
      allowNull: true,
    });

    await queryInterface.changeColumn("assignments", "submittionDueDate", {
      type: Sequelize.DATEONLY,
      allowNull: true
    });

    await queryInterface.addColumn("assignments", "isApplicable", {
      type: Sequelize.BOOLEAN,
      allowNull: true
    });
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('assignments', 'batchId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      after:"week",
      references:{model:'course_batches', key:'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    })
    

    await queryInterface.removeColumn("assignments", "description");
    await queryInterface.removeColumn("assignments", "attachment");
    await queryInterface.removeColumn("assignments", "order");

    await queryInterface.changeColumn("assignments", "submittionDueDate", {
      type: Sequelize.DATEONLY,
      allowNull: false
    });
    
    await queryInterface.removeColumn("assignments", "isApplicable")
  }
};
