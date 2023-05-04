'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.changeColumn('courses', 'learningOutcome', {
      type:Sequelize.TEXT,
      allowNull: true
    })

    await queryInterface.addColumn('courses', 'duration', {
      type: Sequelize.STRING,
      after: 'fees'
    })

    await queryInterface.addColumn('courses', 'batchIntake', {
      type:Sequelize.TEXT,
      after: 'duration'
    })

    await queryInterface.addColumn('courses', 'thumbnail', {
      type: Sequelize.TEXT,
      after: 'batchIntake'
    })

    await queryInterface.addColumn('courses', 'promotionalVideo', {
      type: Sequelize.TEXT,
      after: 'thumbnail'
    })

    await queryInterface.addColumn('courses', 'lastDateToApply', {
      type: Sequelize.DATEONLY,
      after: 'promotionalVideo'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('courses', 'duration', {})

    await queryInterface.removeColumn('courses', 'batchIntake', {})

    await queryInterface.removeColumn('courses', 'thumbnail', {})

    await queryInterface.removeColumn('courses', 'promotionalVideo', {})

    await queryInterface.removeColumn('courses', 'lastDateToApply', {})
  }
};
