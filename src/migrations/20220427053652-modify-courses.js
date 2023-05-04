'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     */
    
    // await queryInterface.addColumn('courses', 'code', { 
    //   type: Sequelize.STRING,
    //   allowNull: false,
    //   after:'id'
    // });

    await queryInterface.addColumn('courses', 'overview', { 
      type: Sequelize.TEXT,
      allowNull: false,
      after: 'title'
    });

    await queryInterface.addColumn('courses', 'learningOutcome', { 
      type: Sequelize.TEXT,
      allowNull: false,
      after: 'overview'
    });

    await queryInterface.addColumn('courses', 'fees', { 
      type: Sequelize.FLOAT(10, 2),
      allowNull: false,
      defaultVAlue: 0,
      after: 'learningOutcome'
    });

    await queryInterface.addColumn('courses', 'termsCount', { 
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultVAlue: 0,
      after: 'fees'
    });

    await queryInterface.addColumn('courses', 'batchesCount', { 
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultVAlue: 0,
      after: 'termsCount'
    });

    await queryInterface.addColumn('courses', 'createdBy', { 
      type: Sequelize.INTEGER,
      allowNull: true,
      after: 'status',
      references:{ model: "users", key: "id"},
      onUpdate: "CASCADE",
      onDelete: 'SET NULL'
    });
    
    await queryInterface.addColumn('courses', 'updatedBy', { 
      type: Sequelize.INTEGER,
      allowNull: true,
      after: 'createdBy',
      references:{ model: "users", key: "id"},
      onUpdate: "CASCADE",
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('courses', 'deletedBy', { 
      type: Sequelize.INTEGER,
      allowNull: true,
      after: 'updatedBy',
      references:{ model: "users", key: "id"},
      onUpdate: "CASCADE",
      onDelete: 'SET NULL'
    });

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     */

    // await queryInterface.removeColumn('courses', 'code');

    await queryInterface.removeColumn('courses', 'overview');

    await queryInterface.removeColumn('courses', 'learningOutcome', { });

    await queryInterface.removeColumn('courses', 'fees');

    // await queryInterface.removeColumn('courses', 'termsCount');

    // await queryInterface.removeColumn('courses', 'batchesCount');

    await queryInterface.removeColumn('courses', 'createdBy');
    
    await queryInterface.removeColumn('courses', 'updatedBy');

    await queryInterface.removeColumn('courses', 'deletedBy');
    
  }
};
