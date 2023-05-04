const { body, check } = require("express-validator");
const { Op } = require("sequelize");
const DB = require("../models");

const AssignmentsModel = DB.assignments;
const UserModel = DB.users;

const saveStudentAssignment = [
  body("studentId")
    .notEmpty()
    .withMessage("Please Enter the Student ID")
    .isNumeric()
    .withMessage("Please Enter the Valid Student ID")
    .custom((value) => {
      return UserModel.findByPk(value).then((user) => {
        if (!user) {
          return Promise.reject("Student does not exists!");
        }
        return true;
      });
    }),
  body("assignmentId")
    .notEmpty()
    .withMessage("Please Enter the Assignment ID")
    .isNumeric()
    .withMessage("Please Enter the Valid Assignment ID")
    .custom((value) => {
      return AssignmentsModel.findByPk(value).then((assignment) => {
        if (!assignment) {
          return Promise.reject("Assignment does not exists!");
        }
        return true;
      });
    }),
  body("resource").notEmpty().withMessage("Please provide the assignment resource"),
  body("status")
    .isIn(["Pending Review", "Reassigned", "Completed"])
    .optional()
    .withMessage("Please enter the valid status"),
  body("publishSatus")
    .isIn(["Pending", "Published"])
    .optional()
    .withMessage("Please enter the valid publish status"),
  body("approvedBy")
    .notEmpty()
    .withMessage("Please Enter the Approver's ID")
    .isNumeric()
    .withMessage("Please Enter the Valid Approver's ID")
    .custom((value) => {
      return UserModel.findByPk(value).then((approver) => {
        if (!approver) {
          return Promise.reject("Approver does not exists!");
        }
        return true;
      });
    }),
];

module.exports = {
  saveStudentAssignment,
};
