const { body, param } = require("express-validator");
const DB = require("../models");

const ClassModel = DB.classes;
const BatchModel = DB.courseBatches;

const saveClassLink = [
  param("id")
    .notEmpty()
    .withMessage("Please Provide the Class Id")
    .isNumeric()
    .withMessage("Please enter a valid class id")
    .custom((value) => {
      return ClassModel.findByPk(value).then((classData) => {
        if (!classData) {
          return Promise.reject("Class does not exists!");
        }
        return true;
      });
    }),
  body("link")
    .notEmpty()
    .withMessage("Please provide the valid of class link url")
    .isURL()
    .withMessage("Please provide a valid url"),
];

const getMentorClassesDetails = [
  body("batchId")
    .notEmpty()
    .withMessage("Please Provide the Batch Id")
    .isNumeric()
    .withMessage("Please enter a valid batch id")
    .custom((value) => {
      return BatchModel.findByPk(value).then((batch) => {
        if (!batch) {
          return Promise.reject("Batch does not exists!");
        }
        return true;
      });
    }),
  body("termNo").optional().isNumeric().withMessage("Please enter the valid term no"),
  body("week").optional().isNumeric().withMessage("Please enter the valid week no"),
];

module.exports = {
  saveClassLink,
  getMentorClassesDetails,
};
