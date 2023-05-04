const { body, param } = require("express-validator");
const moment = require("moment");
const { Op } = require("sequelize");
const DB = require("../models");

const BatchModel = DB.courseBatches;

const createBatch = [
  body("batchNo")
    .notEmpty()
    .withMessage("Please enter batch number!")
    .custom((value, { req }) => {
      return BatchModel.findOne({
        where: {
          batchNo: {
            [Op.eq]: value,
          },
          courseId: {
            [Op.eq]: req.body.courseId,
          },
        },
      }).then((batch) => {
        if (batch) {
          return Promise.reject("Batch number already exists!");
        }
        return true;
      });
    }),
  body("courseId").notEmpty().withMessage("Please select course!"),
  body("startDate")
    .notEmpty()
    .withMessage("Please select start date!")
    .custom((value) => {
      if (moment(value).isSameOrBefore(moment())) {
        throw new Error("Batch start date should not be past date!");
      }
      return true;
    }),
  body("startTime").notEmpty().withMessage("Please enter start time!"),
  body("endTime").notEmpty().withMessage("Please select end time!"),
  body("noOfStudents")
    .notEmpty()
    .withMessage("Please enter numbre of students!")
    .isNumeric()
    .withMessage("No of students should be integer!"),
  body("mentor")
    .notEmpty()
    .withMessage("Please select mentor!")
    .isNumeric()
    .withMessage("Please select valid mentor!"),
  body("batchDays").isArray().withMessage("Please select days for batch!"),
];

const updateBatch = [
  param("batchId")
    .isNumeric()
    .withMessage("Please select the valid batch to edit!")
    .custom((value) => {
      return BatchModel.findByPk(value).then((batch) => {
        if (!batch) {
          return Promise.reject("Batch does not exists!");
        }
        return true;
      });
    }),
  body("batchNo")
    .notEmpty()
    .withMessage("Please enter batch number!")
    .custom((value, { req }) => {
      return BatchModel.findOne({
        where: {
          batchNo: {
            [Op.eq]: value,
          },
          courseId: {
            [Op.eq]: req.body.courseId,
          },
          id: {
            [Op.ne]: req.params.batchId,
          },
        },
      }).then((batch) => {
        if (batch) {
          return Promise.reject("Batch number already exists!");
        }
        return true;
      });
    }),
  body("courseId").notEmpty().withMessage("Please select course!"),
  body("startDate")
    .notEmpty()
    .withMessage("Please select start date!")
    .custom((value) => {
      if (moment(value).isSameOrBefore(moment())) {
        throw new Error("Batch start date should not be past date!");
      }
      return true;
    }),
  body("startTime").notEmpty().withMessage("Please enter start time!"),
  body("endTime").notEmpty().withMessage("Please select end time!"),
  body("noOfStudents")
    .notEmpty()
    .withMessage("Please enter numbre of students!")
    .isNumeric()
    .withMessage("No of students should be integer!"),
  body("mentor")
    .notEmpty()
    .withMessage("Please select mentor!")
    .isNumeric()
    .withMessage("Please select valid mentor!"),
];

const fetchBatch = [
  param("batchId")
    .isNumeric()
    .withMessage("Please select the valid batch!")
    .custom((value) => {
      return BatchModel.findByPk(value).then((batch) => {
        if (!batch) {
          return Promise.reject("Batch does not exists!");
        }
        return true;
      });
    }),
];

const deleteBatch = [
  param("batchId")
    .isNumeric()
    .withMessage("Please select the valid batch!")
    .custom((value) => {
      return BatchModel.findByPk(value).then((batch) => {
        if (!batch) {
          return Promise.reject("Batch does not exists!");
        }
        return true;
      });
    }),
];

const getBatchStudents = [
  body("batchId")
    .notEmpty()
    .withMessage("Please Enter the Batch ID")
    .isNumeric()
    .withMessage("Please select the valid batch!")
    .custom((value) => {
      return BatchModel.findByPk(value).then((batch) => {
        if (!batch) {
          return Promise.reject("Batch does not exists!");
        }
        return true;
      });
    }),
];

const getBatchMentorDetails = [
  body("batchIntake").isDate().optional().withMessage("Please enter a valid batch intake value"),
  body("batchNo").isString().optional().withMessage("Please enter a valid batch number value"),
];

const getBatchClasses = [
  body("date").isDate().optional().withMessage("Please enter a valid date : Format => yyyy-mm-dd"),
];

module.exports = {
  createBatch,
  updateBatch,
  deleteBatch,
  fetchBatch,
  getBatchStudents,
  getBatchMentorDetails,
  getBatchClasses,
};
