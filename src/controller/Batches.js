const ResponseFormatter = require("../utils/ResponseFormatter");
const moment = require("moment");
const { Op, Sequelize } = require("sequelize");
const DB = require("../models");
const { mentorRoleId } = require("../config/siteConfig");

const { isTimeBetween, classDates } = require("../utils/Batches");
const { termNo } = require("../utils/Terms")
const { getNoOfWeeksBetweenDates } = require("../utils/Weeks")
const { weekDay } = require("../utils/DataManipulation");
const sequelize = require("sequelize");
const { userHasRole } = require("../utils/Users");

const CourseModel = DB.courses;
// const CourseTermModel = DB.courseTerms
const BatchModel = DB.courseBatches;
const BatchDaysModel = DB.batchDays;
const UsersModel = DB.users;
const BatchStudentsModel = DB.batchStudents;
const CourseMentorModel = DB.courseUser;
const ClassesModel = DB.classes;
const AttendanceModel = DB.attendance

// const BatchStudentsModel = DB.batchStudents;
const UserModel = DB.users;
// const BatchAttendanceModel = DB.attendances;

const create = async (req, res) => {
  const { batchNo, courseId, startDate, batchDays, startTime, endTime, noOfStudents, mentor } =
    req.body;
  let existsBatchTime = [];
  try {
    const { count: batchesFound, rows: batches } = await BatchModel.findAndCountAll({
      attributes: ["id", "batchCode", "leactureStartTime", "leactureEndTime"],
      where: {
        mentor: mentor,
      },
      include: [
        {
          model: BatchDaysModel,
          attributes: ["weekday"],
          where: {
            weekday: {
              [Op.in]: batchDays,
            },
          },
        },
      ],
      logging: console.log,
    });
    if (batchesFound > 0) {
      const todayDate = new Date().getDate();
      const todayMonth = new Date().getMonth();
      const todayYear = new Date().getFullYear();

      const batchStartTime = new Date(startTime);
      batchStartTime.setDate(todayDate);
      batchStartTime.setMonth(todayMonth);
      batchStartTime.setFullYear(todayYear);
      // console.log(batchStartTime.getTime())

      const batchEndTime = new Date(endTime);
      batchEndTime.setDate(todayDate);
      batchEndTime.setMonth(todayMonth);
      batchEndTime.setFullYear(todayYear);
      // console.log(batchEndTime.getTime())
      const interval = Math.abs(batchEndTime.getTime() - batchEndTime.getTime());
      const newBatchMinutes = Math.round(interval / (60 * 60));

      existsBatchTime = batches.filter((batch) => {
        const existsStarttime = new Date(
          `${todayYear}, ${todayMonth + 1}, ${todayDate}, ${batch.leactureStartTime}`
        );
        const existsEndtime = new Date(
          `${todayYear}, ${todayMonth + 1}, ${todayDate}, ${batch.leactureEndTime}`
        );

        const interval1 = Math.abs(existsStarttime.getTime() - batchStartTime.getTime());
        const totalAvailMinutes = Math.round(interval1 / (60 * 60));

        const interval2 = Math.abs(existsEndtime.getTime() - batchEndTime.getTime());
        const totalAvailMinutes1 = Math.round(interval2 / (60 * 60));

        // console.log(batchStartTime.getTime(), existsStarttime.getTime(), batchEndTime.getTime(), existsEndtime.getTime());
        // console.log(batchStartTime, existsStarttime, batchEndTime, existsEndtime);

        if (
          batchStartTime.getTime() == existsStarttime.getTime() &&
          batchEndTime.getTime() == existsEndtime.getTime()
        ) {
          return true;
        } else if (
          totalAvailMinutes < newBatchMinutes ||
          totalAvailMinutes1 < newBatchMinutes ||
          isTimeBetween(batchStartTime, batchEndTime, existsStarttime, existsEndtime) ||
          isTimeBetween(existsStarttime, existsEndtime, batchStartTime, batchEndTime)
        ) {
          console.log("sfsfsd");
          return true;
        }
      });
    }

    if (existsBatchTime.length > 0) {
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            true,
            400,
            "Batch time conflicts with other batches!",
            "",
            []
          )
        );
    }

    const batch = new BatchModel({
      createdBy: req.user.id,
      batchNo: batchNo,
      courseId: courseId,
      startDate: moment(startDate).format("YYYY-MM-DD"),
      leactureStartTime: moment(startTime).format("HH:mm"),
      leactureEndTime: moment(endTime).format("HH:mm"),
      noOfStudents: noOfStudents,
      mentor: mentor,
      batchDays: {},
    });

    await batch.save({
      include: BatchDaysModel,
    });

    batch.batchDays = await Promise.all(
      batchDays.map(async (day, index) => {
        const batchDay = new BatchDaysModel({
          batchId: batch.id,
          weekDay: day,
        });
        await batchDay.save();
        return batchDay;
      })
    );

    saveBatchClasses(courseId, batch);

    return res
      .status(200)
      .json(ResponseFormatter.setResponse(true, 200, "Batch added successfully.", "", batch));
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(false, 400, "Something went wrong!", "Error", error.message)
      );
  }
};

const getByID = async (req, res, next) => {
  try {
    const batch = await BatchModel.findOne({
      where: {
        id: req.params.batchId,
      },
      include: [
        {
          model: BatchDaysModel,
        },
      ],
    });

    if (batch) {
      return res
        .status(200)
        .json(ResponseFormatter.setResponse(true, 200, "Batch found.", "Success", batch));
    } else {
      return res
        .status(200)
        .json(ResponseFormatter.setResponse(false, 200, "Batch not found!", "Error", ""));
    }
  } catch (error) {
    return res
      .status(422)
      .json(
        ResponseFormatter.setResponse(false, 422, "Something went wrong!", "Error", error.message)
      );
  }
};

const update = async (req, res, next) => {
  const { batchDays } = req.body;
  const { batchId } = req.params;
  let existsBatchTime = [];

  try {
    const { count: batchesFound, rows: batches } = await BatchModel.findAndCountAll({
      attributes: ["id", "batchCode", "leactureStartTime", "leactureEndTime"],
      where: {
        mentor: req.body.mentor,
        id: {
          [Op.ne]: batchId,
        },
      },
      include: [
        {
          model: BatchDaysModel,
          attributes: ["weekday"],
          where: {
            weekday: {
              [Op.in]: batchDays,
            },
          },
        },
      ],
      logging: console.log,
    });
    if (batchesFound > 0) {
      const todayDate = new Date().getDate();
      const todayMonth = new Date().getMonth();
      const todayYear = new Date().getFullYear();

      const batchStartTime = new Date(req.body.startTime);
      batchStartTime.setDate(todayDate);
      batchStartTime.setMonth(todayMonth);
      batchStartTime.setFullYear(todayYear);
      // console.log(batchStartTime.getTime())

      const batchEndTime = new Date(req.body.endTime);
      batchEndTime.setDate(todayDate);
      batchEndTime.setMonth(todayMonth);
      batchEndTime.setFullYear(todayYear);
      // console.log(batchEndTime.getTime())
      const interval = Math.abs(batchEndTime.getTime() - batchEndTime.getTime());
      const newBatchMinutes = Math.round(interval / (60 * 60));

      existsBatchTime = batches.filter((batch) => {
        const existsStarttime = new Date(
          `${todayYear}, ${todayMonth + 1}, ${todayDate}, ${batch.leactureStartTime}`
        );
        const existsEndtime = new Date(
          `${todayYear}, ${todayMonth + 1}, ${todayDate}, ${batch.leactureEndTime}`
        );

        const interval1 = Math.abs(existsStarttime.getTime() - batchStartTime.getTime());
        const totalAvailMinutes = Math.round(interval1 / (60 * 60));

        const interval2 = Math.abs(existsEndtime.getTime() - batchEndTime.getTime());
        const totalAvailMinutes1 = Math.round(interval2 / (60 * 60));

        // console.log(batchStartTime.getTime(), existsStarttime.getTime(), batchEndTime.getTime(), existsEndtime.getTime());
        // console.log(batchStartTime, existsStarttime, batchEndTime, existsEndtime);

        if (
          batchStartTime.getTime() == existsStarttime.getTime() &&
          batchEndTime.getTime() == existsEndtime.getTime()
        ) {
          return true;
        } else if (
          totalAvailMinutes < newBatchMinutes ||
          totalAvailMinutes1 < newBatchMinutes ||
          isTimeBetween(batchStartTime, batchEndTime, existsStarttime, existsEndtime) ||
          isTimeBetween(existsStarttime, existsEndtime, batchStartTime, batchEndTime)
        ) {
          console.log("sfsfsd");
          return true;
        }
      });
    }

    if (existsBatchTime.length > 0) {
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            true,
            400,
            "Batch time conflicts with other batches!",
            "Error",
            []
          )
        );
    }

    const batch = await BatchModel.findByPk(batchId, {
      include: [
        {
          model: BatchDaysModel,
        },
      ],
    });
    const possibleFields = [
      "batchNo",
      "courseId",
      "startDate",
      "startTime",
      "endTime",
      "noOfStudents",
      "mentor",
    ];

    batch.set("updatedBy", req.user.id);

    possibleFields.forEach((field, index) => {
      if(field === "startTime"){
        batch.set("leactureStartTime", moment(req.body[field]).format("HH:mm"));
      }else if(field === "endTime"){
        batch.set("leactureEndTime", moment(req.body[field]).format("HH:mm"));
      }else if(req.body[field]) {
        batch.set(field, req.body[field]);
      }
    });
  console.log("batch ===> ", batch);
    await batch.save();
    await BatchDaysModel.destroy({
      where: {
        batchId: batch.id,
      },
    });
    await ClassesModel.destroy({
      where: { batchId: batch.id },
    });

    batch.dataValues.batchDays = await Promise.all(
      batchDays.map(async (day) => {
        const batchDay = new BatchDaysModel({
          batchId: batch.id,
          weekDay: day,
        });
        await batchDay.save();
        return batchDay;
      })
    );

    saveBatchClasses(batch.dataValues.courseId, batch);

    return res
      .status(200)
      .json(
        ResponseFormatter.setResponse(true, 200, "Batch updated successfully", "Success", batch)
      );
  } catch (error) {
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(false, 400, "Something went wrong!", "Error", error.message)
      );
  }
};

const remove = async (req, res, next) => {
  const { batchId } = req.params;

  try {
    const batch = await BatchModel.findByPk(batchId);
    batch.set("deletedBy", req.user.id);
    await batch.save();

    await BatchModel.destroy({
      where: {
        id: batchId,
      },
    });

    await ClassesModel.destroy({
      where: { batchId: batchId },
    });

    await BatchDaysModel.destroy({
      where: { batchId: batchId },
    });

    return res
      .status(200)
      .json(ResponseFormatter.setResponse(true, 200, "Batch deleted successfully.", "Sucess", ""));
  } catch (error) {
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(false, 400, "Something went wrong!", "Error", error.message)
      );
  }
};

const getAll = async (req, res, next) => {
  try {
    const { status, sortBy, sortOrder, perpage, currentPage, courseId, batchIntake, batchNo } = req.body;
    let orderRecords = [sortBy || "id", sortOrder || "desc"];
    const isMentorLoggedIn = await userHasRole(req.user.id, mentorRoleId)

    let filterBy = {};

    if (batchIntake && batchIntake != "") {
      filterBy[Op.and] = sequelize.where(sequelize.fn("DATE_FORMAT", sequelize.col('startDate'), "%M-%Y"), batchIntake)
    }
    

    if (status && status != "") {
      filterBy.status = {
        [Op.eq]: status,
      };
    }

    if (courseId && courseId != "") {
      filterBy.courseId = {
        [Op.eq]: courseId,
      };
    }


    if (batchNo && batchNo != "") {
      filterBy.batchNo = {
        [Op.eq]: batchNo,
      };
    }

    /*** If trying to get list by mentor then filter by assigned logged in mentor ***/
    if (isMentorLoggedIn) {
      filterBy.mentor = {
        [Op.eq]: req.user.id,
      };
    }
    console.log(filterBy);
    /**********/
    const count = await BatchModel.count({
      where: filterBy,
    });

    let limitperpage = Number.parseInt(perpage) || 10;
    if (perpage === 0) {
      limitperpage = count;
    }

    const batches = await BatchModel.findAll({
      attributes: [
        "id",
        "batchNo",
        "startDate",
        "leactureStartTime",
        "leactureEndTime",
        "noOfStudents",
        "status",
      ],
      where: filterBy,
      order: [orderRecords],
      limit: limitperpage,
      offset: (currentPage - 1) * perpage || 0,
      include: [
        {
          model: BatchDaysModel,
          attributes: ["weekDay"],
        },
        {
          model: CourseModel,
          attributes: ["title"],
        },
        {
          model: UsersModel,
          attributes: ["fname", "lname"],
          as: "mentorAssigned",
        },
        {
          model: BatchStudentsModel,
          attributes: ["id"],
        },
      ],
      logging: console.log
    });
    
    if (count > 0) {
      const response = {
        batches: batches,
        totalRecs: count,
      };
      return res
        .status(200)
        .json(ResponseFormatter.setResponse(true, 200, "Batches found.", "Success", response));
    } else {
      return res
        .status(200)
        .json(ResponseFormatter.setResponse(false, 200, "No Records found!", "Success", ""));
    }
  } catch (error) {
    return res
      .status(422)
      .json(
        ResponseFormatter.setResponse(false, 422, "Something went wrong!", "Error", error.message)
      );
  }
};

const getStudents = async (req, res, next) => {
  try {
    const { status, sortBy, sortOrder, perpage, currentPage, courseId } = req.body;
    let orderRecords = [sortBy || "id", sortOrder || "desc"];
    const isMentorLoggedIn = await userHasRole(req.user.id, mentorRoleId)

    let filterBy = {};

    if (courseId && courseId != "") {
      filterBy.courseId = {
        [Op.eq]: courseId,
      };
    }

    if (courseId && courseId != "") {
      filterBy.courseId = {
        [Op.eq]: courseId,
      };
    }

    if (isMentorLoggedIn) {
      filterBy.mentor = {
        [Op.eq]: req.user.id,
      };
    }

    let data = await BatchModel.findAll({
      attributes: ["batchNo", "leactureStartTime", "leactureEndTime"],
      where: filterBy,
      order: [orderRecords],
      include: [
        {
          model: AttendanceModel,
          attributes: ['staus'],
          include: [
            {
              model: UserModel,
              attributes: ['enroll_id', 'fname', 'lname']
            }
          ]
        },
      ],
    });

    return res
      .status(200)
      .json(ResponseFormatter.setResponse(true, 200, "Batches found.", "Success", data));
  } catch (error) {
    return res
      .status(422)
      .json(
        ResponseFormatter.setResponse(false, 422, "Something went wrong!", "Error", error.message)
      );
  }
};

const getBatches = async (req, res, next) => {
  try {
    const batches = await BatchModel.findAll({
      attributes: [
        "batchNo",
        "courseId",
        [Sequelize.fn("DATE_FORMAT", Sequelize.col("leactureStartTime"), "%h:%i %p"), "startTime"],
        [Sequelize.fn("DATE_FORMAT", Sequelize.col("leactureEndTime"), "%h:%i %p"), "endTime"],
        "noOfStudents",
      ],
      where: {
        startDate: {
          [Op.eq]: moment(req.body.date).format("YYYY-MM-DD"),
        },
      },
    });

    var termNo = "";
    const object = batches.map(async (batch, i) => {
      var weekNo = moment(batch.dataValues.startDate).week();
      if (weekNo < 17) termNo = "Term 1";
      else if (weekNo < 33 && weekNo > 16) termNo = "Term 2";
      else termNo = "Term 3";

      batch.dataValues.batchDate = moment(req.body.date).format("DD/MM/YYYY");
      batch.dataValues.weekNo = weekNo;
      batch.dataValues.termNo = termNo;

      var term = await CourseModel.findAll({
        attributes: ["title"],
        where: { id: batch.dataValues.courseId },
      });
      batch.dataValues.courseName = Object.entries(term)[0][1].dataValues.title;
      return batch;
    });

    setTimeout(async () => {
      var data = await Promise.all(object);
      console.log("data", data);

      return res
        .status(200)
        .json(ResponseFormatter.setResponse(true, 200, "Batches found.", "Success", data));
    }, 500);
  } catch (error) {
    return res
      .status(422)
      .json(
        ResponseFormatter.setResponse(false, 422, "Something went wrong!", "Error", error.message)
      );
  }
};

const getBatchNumbers = async (req, res, next) => {
  try {
    
    const filterBy = {}
    const isMentorLoggedIn = await userHasRole(req.user.id, mentorRoleId)
    if(isMentorLoggedIn){
      filterBy.mentor = req.user.id
    }
    const {rows: batchNumbers} = await BatchModel.findAndCountAll({
      attributes: ["batchNo"],
      where: filterBy,
      group: ["batchNo"]
    });

    if (batchNumbers.length > 0) {
      return res
        .status(200)
        .json(
          ResponseFormatter.setResponse(true, 200, "Batch Numbers Listed", "success", batchNumbers)
        );
    }

    return res
      .status(200)
      .json(ResponseFormatter.setResponse(true, 200, "No Batches Found", "success", []));
  } catch (error) {
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(false, 400, "Something Went Wrong", "error", error.message)
      );
  }
};

const getBatchesIntake = async (req, res) => {
  try {
    let responseData = {};

    const filterBy = {}
    const isMentorLoggedIn = await userHasRole(req.user.id, mentorRoleId)
    if(isMentorLoggedIn){
      filterBy.mentor = req.user.id
    }

    const batchesIntake = await BatchModel.findAndCountAll({
      where: filterBy,
      attributes: [[sequelize.fn("DATE_FORMAT", sequelize.col('startDate'), "%M-%Y"), "startDate"]],
      group: [sequelize.fn("DATE_FORMAT", sequelize.col('startDate'), "%M-%Y")],
      logging: console.log
    });

    let result = [];

    for (const batchIntake of batchesIntake.rows) {
      if (!result.includes(batchIntake.startDate)) {
        result.push(batchIntake.startDate);
      }
    }

    responseData = {
      totalRecs: result.length,
      batchIntake: result,
    };

    if (result.length > 0) {
      return res
        .status(200)
        .json(
          ResponseFormatter.setResponse(true, 200, "Batches Intake Listed", "success", responseData)
        );
    }

    return res
      .status(200)
      .json(ResponseFormatter.setResponse(true, 200, "No Batches Found", "success", []));
  } catch (error) {
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(false, 400, "Something went wrong", "error", error.message)
      );
  }
};

const getBatchStudents = async (req, res, next) => {
  try {

    let response = {}
    const { batchId } = req.body
    const data = await BatchModel.findOne({
      attributes: ["batchNo", "leactureStartTime", "leactureEndTime"],
      where: { id: batchId },
      include: [
        {
          model: BatchStudentsModel,
          attributes: ['studentId'],
          include: [
            {
              model: UserModel,
              attributes: ['enroll_id', 'fname', 'lname']
            },
          ]
        },
      ],
    });

    const batchStudents = data.batchStudents
    const studentList = []
    for(const batchStudent of batchStudents) {
      const classesAttended = await AttendanceModel.count({
        where: {
          batchId: batchId,
          studentId: batchStudent.studentId,
          staus: 'Present'
        }
      })
      studentList.push({
        enrollId: batchStudent.user.enroll_id,
        name: batchStudent.user.fname + ' ' + batchStudent.user.lname,
        classesAttended: classesAttended
      })
    }

    const totalClasses = await ClassesModel.count({
      where: {
        batchId: batchId
      }
    })

    const classesDone = await ClassesModel.count({
      where: {
        batchId: batchId,
        classDate: {
          [Op.lte]: moment().toDate()
        }
      }
    })

    response = {
      batchNo: data.batchNo,
      totalClasses,
      classesDone,
      leactureStartTime: data.leactureStartTime,
      leactureEndTime: data.leactureEndTime,
      batchStudents: studentList,
    }
    

    return res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Student Listed', 'success', response))
    } catch (error) {
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(false, 400, "Something went wrong", "error", error.message)
      );
  }
};

const getMentorBatchDetails = async (req, res, next) => {
  try {
    let responseData = {};
    const mentorId = req.user.id;

    const { batchIntake, batchNo } = req.body;

    // Getting Mentor's Batches
    let batches = [];
    if (batchIntake && batchNo) {
      batches = await BatchModel.findAndCountAll({
        where: {
          mentor: mentorId,
          startDate: batchIntake,
          batchNo: batchNo,
        },
      });
    } else if (batchIntake) {
      batches = await BatchModel.findAndCountAll({
        where: {
          mentor: mentorId,
          startDate: batchIntake,
        },
      });
    } else if (batchNo) {
      batches = await BatchModel.findAndCountAll({
        where: {
          mentor: mentorId,
          batchNo: batchNo,
        },
      });
    } else {
      batches = await BatchModel.findAndCountAll({
        where: {
          mentor: mentorId,
        },
      });
    }

    // Getting Mentor's Course
    const course = await CourseMentorModel.findOne({
      where: { userId: mentorId },
    });

    if (!course) {
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Course is not allocated to this mentor",
            "error"
          )
        );
    }

    const courseDetail = await CourseModel.findOne({
      where: { id: course.courseId },
    });

    let result = [];
    for (const batch of batches.rows) {
      // Getting student for this batch
      const students = await BatchStudentsModel.findAndCountAll({
        where: { batchId: batch.dataValues.id },
        attributes: ["studentId"],
      });

      let batchTemplate = {
        id: batch.dataValues.id,
        batchNo: batch.dataValues.batchNo,
        startDate: batch.dataValues.startDate,
        lectureStartTime: batch.dataValues.leactureStartTime,
        lectureEndTime: batch.dataValues.leactureEndTime,
        noOfStudents: batch.dataValues.noOfStudents,
        status: batch.dataValues.status,
        course: {
          title: courseDetail.dataValues.title,
        },
        mentor: {
          fname: req.user.fname,
          lname: req.user.lname,
        },
        students: students.rows,
      };
      result.push(batchTemplate);
    }

    responseData = {
      totalRecs: result.length,
      batches: result,
    };

    return res
      .status(200)
      .json(ResponseFormatter.setResponse(true, 200, "Batches Listed", "success", responseData));
  } catch (error) {
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(false, 400, "Something went wrong", "error", error.message)
      );
  }
};

const getBatchClasses = async (req, res, next) => {
  try {
    const { date } = req.body

    let response = []

    let filterBy = {};

    if (date && date != "") {
      filterBy.classDate = {
        [Op.eq]: date,
      };
    }

    const mentorId = req.user.id
    let batches = await BatchModel.findAll({
      where: {
        mentor: mentorId
      },
      attributes: ['batchNo', 'noOfStudents', 'startDate'],
      include: [
        {
          model: CourseModel,
          attributes: ['title']
        },
        {
          model: ClassesModel,
          attributes: ['classDate', 'startTime', 'endTime'],
          where: filterBy
        },    
      ]
    })

    // Calculating Week No for each class
    for(const batch of batches) {
      let classes = []
      for(const classData of batch.classes) {
        const week = getNoOfWeeksBetweenDates(batch.startDate, classData.classDate)
        const term = termNo(week)
        classes.push({
          classDate: classData.classDate,
          startTime: classData.startTime,
          endTime: classData.endTime,
          week: week + 1,
          term: term
        })
      }
      response.push({
        batchNo: batch.batchNo,
        noOfStudents: batch.noOfStudents,
        startDate: batch.startDate,
        course: batch.course.title,
        classes: classes
      })
    }

    res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Classes Listed', "success", response))

  } catch (error) {
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(false, 400, "Something Went Wrong", "error", error.message)
      );
  }
};

const saveBatchClasses = async (courseId, batch) => {
  // Getting Course to get No. of Weeks
  const courseDetails = await CourseModel.findOne({
    where: { id: courseId },
  });

  // Getting Batch Days
  let arrayOfBatchDays = [];
  for (const batchDay of batch.batchDays) {
    arrayOfBatchDays.push(batchDay.weekDay);
  }

  // Getting Class Dates Array
  const classesDates = classDates(
    batch.dataValues.startDate,
    courseDetails.duration,
    arrayOfBatchDays
  );

  // Saving Each Class
  const classList = classesDates.map(classDate => {
    return {
      courseId: courseId,
      batchId: batch.id,
      classDate: moment(classDate).format('YYYY-MM-DD'),
      startTime: batch.leactureStartTime,
      endTime: batch.leactureEndTime
    }
  })
  
  await ClassesModel.bulkCreate(classList)
  
}

module.exports = {
  create,
  getByID,
  update,
  remove,
  getAll,
  getStudents,
  getBatches,
  getBatchNumbers,
  getBatchesIntake,
  getBatchStudents,
  getMentorBatchDetails,
  getBatchClasses
};
