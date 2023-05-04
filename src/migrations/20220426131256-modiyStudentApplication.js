'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.addColumn('student_applications', 'assigedMentor', { 
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      after: 'resume'
    });

    await queryInterface.addColumn('student_applications', 'showReelFeedback', { 
      type: Sequelize.TEXT,
      allowNull:true,
      after:'assigedMentor'
    });
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.removeColumn('student_applications', 'assigedMentor');
    await queryInterface.removeColumn('student_applications', 'showReelFeedback');
  }
};
