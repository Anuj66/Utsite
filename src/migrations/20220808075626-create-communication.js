'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('communications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      reciever: {
        type: Sequelize.INTEGER
      },
      message: {
        type: Sequelize.STRING
      },
      isPublished: {
        type: Sequelize.BOOLEAN
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references:{ model:'users', key:'id'},
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        refernces:{ model: 'users', key:'id'},
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references:{ model:'users', key:'id'},
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    
    await queryInterface.addConstraint('communications', {
      fields: ['reciever'],
      type: 'foreign key',
      name: 'communication_for_roleId',
      references: { //Required field
        table: 'user_roles',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },
  async down(queryInterface, Sequelize) {
    
    await queryInterface.dropTable('communications');
  }
};
