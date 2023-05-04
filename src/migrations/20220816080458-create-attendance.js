"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("attendances", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      courseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      batchId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      studentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      classId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      staus: {
        type: Sequelize.ENUM("Present", "Absent"),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addConstraint("attendances", {
      type: "foreign key",
      name: "attendances_ibfk_1",
      fields: ["courseId"],
      references: {
        table: "courses",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });

    await queryInterface.addConstraint("attendances", {
      type: "foreign key",
      name: "attendances_ibfk_2",
      fields: ["batchId"],
      references: {
        table: "course_batches",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });

    await queryInterface.addConstraint("attendances", {
      type: "foreign key",
      name: "attendances_ibfk_3",
      fields: ["studentId"],
      references: {
        table: "users",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });

    await queryInterface.addConstraint("attendances", {
      type: "foreign key",
      name: "attendances_ibfk_4",
      fields: ["classId"],
      references: {
        table: "classes",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("attendances", "attendances_ibfk_1");
    await queryInterface.removeConstraint("attendances", "attendances_ibfk_2");
    await queryInterface.removeConstraint("attendances", "attendances_ibfk_3");
    await queryInterface.removeConstraint("attendances", "attendances_ibfk_4");

    await queryInterface.dropTable("attendances");
  },
};
