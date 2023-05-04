const ResponseFormatter = require("../utils/ResponseFormatter");
const moment = require("moment");
const { Op } = require("sequelize");
const DB = require("../models");
const {
  mentorRoleId, noOfTermsPerCourse, durationOfEachTerm
} = require("../config/siteConfig");
const { moveFile, resize } = require("../utils/FileSystem");
const { slugify } = require("../utils/Strings");
const {courseTermsArrToCreate} = require("../utils/Terms");
const sequelize = require("sequelize");

const CourseModel = DB.courses;
const MentorModel = DB.users;
const assignedrolesModel = DB.assignedRoles;
const CourseTermModel = DB.courseTerms;
const BatchModel = DB.courseBatches

const create = async (req, res) => {
  const {
    title,
    duration,
    overview,
    status,
    fees,
    lastDateToApply,
    description
  } = req.body;

  try {
    
    /** move uploaded file **/
    const coursePath = `courses/${slugify(req.body.title)}`;
    
    // const filepPath = await resize(386, 217, coursePath, req.files.thumbnail[0]) // resize and move
    await moveFile(req.files.thumbnail[0].filename, `${coursePath}/${req.files.thumbnail[0].filename}`)
    await moveFile( req.files.promotionalVideo[0].filename, `${coursePath}/${req.files.promotionalVideo[0].filename}` );

    const course = await CourseModel.create({
      title: title,
      duration: duration,
      overview: overview,
      status: status,
      lastDateToApply: moment(lastDateToApply).format("YYYY-MM-DD"),
      fees: fees,
      description:description,
      createdBy: req.user.id,
      thumbnail: `${coursePath}/${req.files.thumbnail[0].filename}`,
      promotionalVideo: `${coursePath}/${req.files.promotionalVideo[0].filename}`,
    });
    
    /**
     * mananged the terms of courses
     * Each courses has fixed number(4) of courses 
     */
    const TermsList = courseTermsArrToCreate(course.id)
    await CourseTermModel.bulkCreate(TermsList)

    return res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Course added successfully.",
          "",
          course
        )
      );
  } catch (error) {
    
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong!",
          "Error",
          error.message
        )
      );
  }
};

const getByID = async (req, res, next) => {
  try {
    const course = await CourseModel.findOne({
      where: {
        id: req.params.courseId,
      },
      include: [
        {
          model: MentorModel,
          attributes: ["fname", "lname"],
          include: {
            model: assignedrolesModel,
            attributes: [],
            where: {
              roleId: mentorRoleId,
            },
          },
        },
        {
          model: BatchModel,
          attributes:['startDate'],
        }
      ],
    });

    if (course) {
      return res
        .status(200)
        .json(
          ResponseFormatter.setResponse(
            true,
            200,
            "Course found.",
            "Success",
            course
          )
        );
    } else {
      return res
        .status(404)
        .json(
          ResponseFormatter.setResponse(
            false,
            404,
            "Course not found!",
            "Error",
            ""
          )
        );
    }
  } catch (error) {
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong!",
          "Error",
          error.message
        )
      );
  }
};

const update = async (req, res, next) => {
  const courseId = req.params.courseId;

  try {
    const course = await CourseModel.findByPk(courseId);
    const possibleFields = [
      "title",
      "duration",
      "overview",
      "status",
      "fees",
      "lastDateToApply",
      "description"
    ];

    course.set("updatedBy", req.user.id);

    /** move uploaded file **/
    const coursePath = `courses/${slugify(req.body.title)}`;

    if (req.files.thumbnail) {
      // const filepPath = await resize(386, 217, coursePath, req.files.thumbnail[0], course.thumbnail) // resize file from uploaded and move to course folder
      await moveFile(req.files.thumbnail[0].filename, `${coursePath}/${req.files.thumbnail[0].filename}`, course.thumbnail)
      course.set('thumbnail', `${coursePath}/${req.files.thumbnail[0].filename}`)      
    }

    if (req.files.promotionalVideo) {
      moveFile(
        req.files.promotionalVideo[0].filename,
        `${coursePath}/${req.files.promotionalVideo[0].filename}`,
        course.promotionalVideo
      );
      course.set('promotionalVideo', `${coursePath}/${req.files.promotionalVideo[0].filename}`)
    }
    /**********/

    possibleFields.forEach((field, index) => {
      if (req.body[field]) {
        course.set(field, req.body[field]);
      }
    });

    await course.save();
    return res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Course updated successfully",
          "Success",
          course
        )
      );
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong!",
          "Error",
          error.message
        )
      );
  }
};

const remove = async (req, res, next) => {
  const courseId = req.params.courseId;

  try {
    const course = await CourseModel.findByPk(courseId);
    course.set("deletedBy", req.user.id);
    await course.save();

    await CourseModel.destroy({
      where: {
        id: courseId,
      },
    });

    await CourseTermModel.destroy({
      where: {
        courseId: courseId
      }
    })

    return res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Course deleted successfully.",
          "Sucess",
          ""
        )
      );
  } catch (error) {
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong!",
          "Error",
          error.message
        )
      );
  }
};

const getAll = async (req, res, next) => {
  try {
    const { status, searchStr, sortBy, sortOrder, perpage, currentPage, courseId } =
      req.body;
    let orderRecords = [sortBy || "id", sortOrder || "desc"];

    let filterBy = {};

    if (status && status != "") {
      filterBy.status = {
        [Op.eq]: status,
      };
    }

    if(searchStr && searchStr != ''){
      filterBy[Op.or] = {
          title:{
              [Op.substring]:searchStr    
          },
          overview: {
              [Op.substring]:searchStr
          }
      }
    }

    const count = await CourseModel.count({
      where: filterBy,
    });

    let limitperpage = Number.parseInt(perpage) || 10;
    if (perpage === 0) {
      limitperpage = count;
    }

    const courses = await CourseModel.findAll({
      attributes: [
        "id",
        "title",
        "overview",
        "duration",
        "thumbnail",
      ],
      where: filterBy,
      include:[
        {
          model: BatchModel,
          attributes:['startDate'],
        }
      ],
      order: [orderRecords],
      limit: limitperpage,
      offset: (currentPage - 1) * perpage || 0,

    });

    if (count > 0) {
      const response = {
        courses: courses,
        totalRecs: count,
      };
      return res
        .status(200)
        .json(
          ResponseFormatter.setResponse(
            true,
            200,
            "Courses found.",
            "Success",
            response
          )
        );
    } else {
      return res
        .status(200)
        .json(
          ResponseFormatter.setResponse(
            false,
            200,
            "No Records found!",
            "Success",
            ""
          )
        );
    }
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong!",
          "Error",
          error.message
        )
      );
  }
};

const getList = async (req, res, next) => {
  try {
    const courses = await CourseModel.findAll({
      attributes: ["id", "title"],
      where: {
        status: "active",
      },
    });

    if (courses) {
      res
        .status(200)
        .json(
          ResponseFormatter.setResponse(
            true,
            200,
            "Courses found.",
            "Success",
            courses
          )
        );
    } else {
      res
        .status(200)
        .json(
          ResponseFormatter.setResponse(
            true,
            200,
            "Courses not found!",
            "Success",
            courses
          )
        );
    }
  } catch (error) {
    res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong",
          "Error",
          error.message
        )
      );
  }
};

const getCourseMentors = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await CourseModel.findOne({
      where: {
        id: courseId,
      },
      attributes: [],
      include: [
        {
          model: MentorModel,
          attributes: ["id", "fname", "lname"],
          include: {
            model: assignedrolesModel,
            attributes: [],
            where: {
              roleId: mentorRoleId,
            },
          },
        },
      ],
    });

    if (course && course.users && course.users.length > 0) {
      return res
        .status(200)
        .json(
          ResponseFormatter.setResponse(
            true,
            200,
            "Mentors found.",
            "Success",
            course.users
          )
        );
    } else {
      return res
        .status(200)
        .json(
          ResponseFormatter.setResponse(
            false,
            200,
            "Mentors not found!",
            "Error",
            ""
          )
        );
    }
  } catch (error) {
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong!",
          "Error",
          error.message
        )
      );
  }
};


module.exports = {
  create,
  getByID,
  update,
  remove,
  getAll,
  getList,
  getCourseMentors,
};
