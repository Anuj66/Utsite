const ResponseFormatter = require("../utils/ResponseFormatter");
const moment = require("moment");
const mv = require("mv");
const fs = require("fs");
const { Op } = require("sequelize");
const DB = require("../models");

const AssignmentModel = DB.assignments;
const CourseModel = DB.courses;
const CourseTermModel = DB.courseTerms;
const CourseBatchModel = DB.courseBatches;
const BatchStudentModel = DB.batchStudents;
const UserModel = DB.users;
const StudentAssignmentModel = DB.student_assignments;

const getAll = async (req, res) => {
  const { courseTitle, batchIntake, batchNo, termNo, weekNo, status } = req.body;
  let course,
    term,
    batch = [];
  try {
    let courseFilter = {};
    if (courseTitle) {
      courseFilter.title = courseTitle;
    }
    if (batchIntake) {
      courseFilter.batchIntake = batchIntake;
    }
    course = await CourseModel.findOne({
      where: courseFilter,
    });

    if (batchNo) {
      batch = await CourseBatchModel.findOne({
        where: { batchNo: batchNo, courseId: course.dataValues.id },
      });
    } else {
      batch = await CourseBatchModel.findOne({
        where: { courseId: course.dataValues.id },
      });
    }

    if (termNo) {
      term = await CourseTermModel.findOne({
        where: { termNo: termNo, courseId: course.dataValues.id },
      });
    } else {
      term = await CourseTermModel.findOne({
        where: { courseId: course.dataValues.id },
      });
    }
    let filterBy = {
      courseId: course.dataValues.id,
      termId: term.dataValues.id,
      batchId: batch.dataValues.id,
    };
    if (weekNo) {
      filterBy.weekId = { [Op.eq]: weekNo };
    }

    if (status) {
      filterBy.status = { [Op.eq]: status };
    }

    const { count } = await AssignmentModel.findAndCountAll({
      where: filterBy,
    });

    let assignment = await AssignmentModel.findAll({
      where: filterBy,
    });

    if (count > 0) {
      return res
        .status(200)
        .json(
          ResponseFormatter.setResponse(true, 200, "Assignments found.", "Success", assignment)
        );
    } else {
      return res
        .status(200)
        .json(ResponseFormatter.setResponse(true, 200, "No records found.", "Success", ""));
    }
  } catch (error) {
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(false, 400, "Something went wrong!", "Error", error.message)
      );
  }
};

const createStudentAssignment = async (req, res, next) => {
  try {
    const { studentId, assignmentId, resource, status, publishSatus, approvedBy } = req.body;

    let dataToBeSaved = {
      studentId,
      assignmentId,
      resource,
      status,
      publishSatus,
      approvedBy,
    }

    const studentAssignmentExists = await StudentAssignmentModel.findOne({
      where: {
        studentId: studentId,
        assignmentId: assignmentId
      }
    })

    if(studentAssignmentExists) {
        dataToBeSaved = {id: studentAssignmentExists.id, ...dataToBeSaved, updatedBy: req.user.id}
    } else {
      dataToBeSaved = {...dataToBeSaved, createdBy: req.user.id}
    }

    const savedData = await StudentAssignmentModel.upsert(dataToBeSaved);

    return res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Assignment Saved Successfully",
          "success",
          savedData
        )
      );
  } catch (error) {
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(false, 400, "Something went wrong", "error", error.message)
      );
  }
};

module.exports = {
  getAll,
  createStudentAssignment
};
