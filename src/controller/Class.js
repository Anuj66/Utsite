const DB = require("../models");
const ResponseFormatter = require("../utils/ResponseFormatter");
const sequelize = require("sequelize");
const { Op, Sequelize } = require("sequelize");
const { durationInMonthsOfEachTerm, totalWeeksInMonth } = require("../config/siteConfig");
const moment = require("moment");

const ClassModel = DB.classes;
const BatchModel = DB.courseBatches;
const AttendanceModel = DB.attendance;

const saveClassLinkById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { link } = req.body;

    const result = await ClassModel.update(
      {
        link: link,
      },
      {
        where: { id: id },
      }
    );

    return res.status(200).json(
      ResponseFormatter.setResponse(true, 200, "Classes Saved Successfully", "success", {
        RecordsUpdated: result,
      })
    );
  } catch (error) {
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(false, 400, "Something went wrong", "error", error.message)
      );
  }
};

const getMentorClassesDetails = async (req, res, next) => {
  try {
    const { batchId, termNo, week } = req.body;

    const startDate = await BatchModel.findOne({
      where: { id: batchId }
    })

    let rangeStart = ''
    let rangeEnd = ''

    if(termNo) {
      rangeStart = (termNo - 1) * durationInMonthsOfEachTerm * totalWeeksInMonth
    }

    if(week) {
      rangeStart = rangeStart + week
      rangeEnd = rangeStart + 1
    } else {
      rangeEnd = (termNo) * durationInMonthsOfEachTerm * totalWeeksInMonth
    }

    let rangeStartingDate = moment(startDate).add(rangeStart-1, 'weeks')
    let rangeEndingDate = moment(startDate).add(rangeEnd-1, 'weeks')
    
    let filterBy = {};

    if (batchId && batchId != "") {
      filterBy.batchId = {
        [Op.eq]: batchId,
      };
    }

    if((termNo) || (termNo && week)) {
      filterBy.classDate = {
        [Op.gte]: rangeStartingDate,
        [Op.lte]: rangeEndingDate
      }
    }

    const classes = await ClassModel.findAll({
      attributes: ["id", "classDate", "startTime", "endTime"],
      where: filterBy,
      include: [
        {
          model: BatchModel,
          attributes: [
            "id",
            [sequelize.fn("DATE_FORMAT", sequelize.col("startDate"), "%M-%Y"), "startDate"],
          ],
        },
        // {
        //   model: AttendanceModel,
        //   attributes: [sequelize.fn('COUNT', sequelize.col('classId')), "Student Count"],
        //   where: { staus: 'Present'},
        //   group: ['classId']
        // }
      ],
    });

    let response = [];

    for (const classObj of classes) {
      const studentCount = await AttendanceModel.count({
        where: {
          classId: classObj.id,
          staus: "Present",
        },
      });

      response.push({
        classObj,
        studentCount,
      });
    }

    return res
      .status(200)
      .json(ResponseFormatter.setResponse(true, 200, "Classes Listed", "success", response));
  } catch (error) {
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(false, 400, "Something went wrong", "error", error.message)
      );
  }
};

module.exports = {
  saveClassLinkById,
  getMentorClassesDetails,
};
