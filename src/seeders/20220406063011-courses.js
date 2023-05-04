'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('courses', [
      {
        title: 'Creature FX',
        overview: 'Creature FX',
        learningOutcome: 'Creature FX',
        fees: 0.00,
      },
      {
        title: '3D Character Animation',
        overview: '3D Character Animation',
        learningOutcome: '3D Character Animation',
        fees: 0.00
      },
      {
        title: 'VFX Compositing',
        overview: 'VFX Compositing',
        learningOutcome: 'VFX Compositing',
        fees: 0.00
      },
      {
        title: 'FX',
        overview: 'FX',
        learningOutcome: 'FX',
        fees: 0.00
      },
      {
        title: 'Realtime 3D Cinematics',
        overview: 'Realtime 3D Cinematics',
        learningOutcome: 'Realtime 3D Cinematics',
        fees: 0.00
      },
      {
        title: 'Look Development',
        overview: 'Look Development',
        learningOutcome: 'Look Development',
        fees: 0.00
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('courses', null, {});
  }
};
