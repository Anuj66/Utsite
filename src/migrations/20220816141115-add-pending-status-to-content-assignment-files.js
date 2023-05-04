'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn("contents", "status", {
      type: Sequelize.ENUM("Pending", "Not Applicable", "Not Uploaded", "Uploaded But Not Approved", "Approved"),
      allowNull: true,
      defaultValue: null
    })

    await queryInterface.changeColumn("contents", "evaluationStatus", {
      type: Sequelize.ENUM(
        "Pending",
        "Not Applicable",
        "Not Uploaded",
        "Pending For Evaluation",
        "Evaluated But Not Approved",
        "Approved"
      ),
      allowNull: true,
    });

    await queryInterface.changeColumn("assignments", "status", {
      type: Sequelize.ENUM("Pending", "Not Applicable", "Not Uploaded", "Uploaded But Not Approved", "Approved"),
      allowNull: true,
      defaultValue: null
    })

    await queryInterface.changeColumn("assignments", "evaluationStatus", {
      type: Sequelize.ENUM(
        "Pending",
        "Not Applicable",
        "Not Uploaded",
        "Pending For Evaluation",
        "Evaluated But Not Approved",
        "Approved"
      ),
      allowNull: true,
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn("contents", "status", {
      type: Sequelize.ENUM("Not Applicable", "Not Uploaded", "Uploaded But Not Approved", "Approved"),
      allowNull: true,
      defaultValue: null
    })

    await queryInterface.changeColumn("contents", "evaluationStatus", {
      type: Sequelize.ENUM(
        "Not Applicable",
        "Not Uploaded",
        "Pending For Evaluation",
        "Evaluated But Not Approved",
        "Approved"
      ),
      allowNull: true,
    });

    await queryInterface.changeColumn("assignments", "status", {
      type: Sequelize.ENUM("Not Applicable", "Not Uploaded", "Uploaded But Not Approved", "Approved"),
      allowNull: true,
      defaultValue: null
    })

    await queryInterface.changeColumn("assignments", "evaluationStatus", {
      type: Sequelize.ENUM(
        "Not Applicable",
        "Not Uploaded",
        "Pending For Evaluation",
        "Evaluated But Not Approved",
        "Approved"
      ),
      allowNull: true,
    });
  }
};
