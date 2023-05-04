const { body, check, param } = require("express-validator");
const { Op } = require("sequelize");
const DB = require("../models");

const CourseModel = DB.courses;
const CourseTermModel = DB.courseTerms;
const AssignmentsModel = DB.assignments;
const ContentModel = DB.content;
const UserModel = DB.users;

const uploadTempResource = [
  body("courseId")
    .notEmpty()
    .withMessage("Please select the valid course!")
    .custom((value) => {
      return CourseModel.findByPk(value).then((course) => {
        if (!course) {
          return Promise.reject("Course does not exists!");
        }
        return true;
      });
    }),
  body("termId")
    .notEmpty()
    .withMessage("Please select the valid term!")
    .custom((value) => {
      return CourseTermModel.findByPk(value).then((term) => {
        if (!term) {
          return Promise.reject("Term does not exists!");
        }
        return true;
      });
    }),
  body("week").notEmpty().withMessage("Please select week numner!"),
  body("content_type").notEmpty().withMessage("Please select content type!"),
  body("resourse").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("Please upload resourse file!");
    }
    return true;
  }),
];

const deleteTempResource = [
  body("contentIds")
    .isArray()
    .custom((value, { req }) => {
      const contentType = req.body.content_type;
      if (contentType === "assignment") {
        return AssignmentsModel.count({
          where: {
            id: {
              [Op.in]: value,
            },
          },
        }).then((count) => {
          if (count < value.length) {
            return Promise.reject("Invalid content ids passed!");
          }
          return true;
        });
      } else {
        return ContentModel.count({
          where: {
            id: {
              [Op.in]: value,
            },
          },
        }).then((count) => {
          if (count < value.length) {
            return Promise.reject("Invalid content ids passed!");
          }
          return true;
        });
      }
    }),
];

const uploadResource = [
  body("contentDetails").isArray({ min: 1 }).withMessage("Please enter content file data!"),
  body("contentDetails.*.id").notEmpty().withMessage("Please insert valid content id!"),
  body("contentDetails.*.status").notEmpty().withMessage("Please insert status!"),
  body("contentDetails.*.description").exists().withMessage("Please insert description!"),
  body("contentDetails.*.isNotApplicable")
    .notEmpty()
    .withMessage("Please insert is Not Applicable!"),
  body("contentDetails.*.order").notEmpty().withMessage("Please insert order!"),
  body("contentDetails.*.content_type").notEmpty().withMessage("Please insert content_type!"),
  // .custom((value, {req}) => {
  //   const contentType = req.body.content_type

  //   if(contentType === "assignment"){
  //     return AssignmentsModel.findByPk({
  //       where: {
  //         id: value
  //       }
  //     }).then(assignment => {
  //       if(!assignment){
  //         return Promise.reject('Invalid content ids passed!')
  //       }
  //       return true
  //     })
  //   }else{
  //     return ContentModel.count({
  //       where: {
  //         id: value
  //       }
  //     }).then(content => {
  //       if(!content){
  //         return Promise.reject('Invalid content ids passed!')
  //       }
  //       return true
  //     })
  //   }
  // }),
];

const getDashboardData = [
  body("termNo")
    .isNumeric()
    .optional({ nullable: true })
    .withMessage("Please Enter the Valid Term No"),
  body("week").isNumeric().optional({ nullable: true }).withMessage("Please Enter the Valid Week"),
];

const getContentDetails = [
  body("courseId")
    .notEmpty()
    .withMessage("Please enter the Course Id")
    .isNumeric()
    .withMessage("Please enter the valid course id")
    .custom((value) => {
      return CourseModel.findByPk(value).then((course) => {
        if (!course) {
          return Promise.reject("Course does not exists!");
        }
        return true;
      });
    }),
  body("termId")
    .notEmpty()
    .withMessage("Please enter the Term Id")
    .isNumeric()
    .optional()
    .withMessage("Please Enter the Valid Term ID")
    .custom((value) => {
      return CourseTermModel.findByPk(value).then((term) => {
        if (!term) {
          return Promise.reject("Term does not exists!");
        }
        return true;
      });
    }),
  body("week")
    .notEmpty()
    .withMessage("Please enter the Week No")
    .isNumeric()
    .withMessage("Please enter the valid week no"),
];

const getMentorContents = [
  body("courseId")
    .notEmpty()
    .withMessage("Course Id not provided")
    .isNumeric()
    .withMessage("Please enter the valid course id")
    .custom((value) => {
      return CourseModel.findByPk(value).then((course) => {
        if (!course) {
          return Promise.reject("Course does not exists!");
        }
        return true;
      });
    }),
  body("termId")
    .isNumeric()
    .optional()
    .withMessage("Please Enter the Valid Term ID")
    .custom((value) => {
      return CourseTermModel.findByPk(value).then((term) => {
        if (!term) {
          return Promise.reject("Term does not exists!");
        }
        return true;
      });
    }),
  body("weekId").isNumeric().optional().withMessage("Please Enter the Valid Week Number"),
];

const saveContents = [
  body("courseId")
    .notEmpty()
    .withMessage("Please select course!")
    .isNumeric()
    .withMessage("Please select valid course!")
    .custom((value) => {
      return CourseModel.findByPk(value).then((course) => {
        if (!course) {
          return Promise.reject("Course does not exists!");
        }
        return true;
      });
    }),
  body("termId")
    .notEmpty()
    .withMessage("Please select term!")
    .isNumeric()
    .withMessage("Please select valid term!")
    .custom((value) => {
      return CourseTermModel.findByPk(value).then((term) => {
        if (!term) {
          return Promise.reject("Term does not exists!");
        }
        return true;
      });
    }),
  body("week")
    .notEmpty()
    .withMessage("Please selecy week number!")
    .isNumeric()
    .withMessage("Please enter the valid week number"),

  body("contentFiles").isArray({ min: 1 }).withMessage("Please upload content files!"),
  body("contentFiles.*.type").notEmpty().withMessage("Please select file status!"),
  body("contentFiles.*.isApplicable").notEmpty().withMessage("Please pass applicable status!"),
  body("contentFiles.*.order").notEmpty().withMessage("Please pass content file order!"),
  body("contentFiles.*.resources").custom((value, { req }) => {
    if (!req.files.resources) {
      throw new Error("Please upload content resources!");
    }
    return true;
  }),
];

const getContentCount = [
  body("courseId")
    .isNumeric()
    .optional({ nullable: true })
    .withMessage("Please Enter the Valid Course ID")
    .custom((value) => {
      return CourseModel.findByPk(value).then((course) => {
        if (!course) {
          return Promise.reject("Course does not exists!");
        }
        return true;
      });
    }),
  body("termId")
    .isNumeric()
    .optional({ nullable: true })
    .withMessage("Please Enter the Valid Term ID")
    .custom((value) => {
      return CourseTermModel.findByPk(value).then((term) => {
        if (!term) {
          return Promise.reject("Term does not exists!");
        }
        return true;
      });
    }),
];

const saveContentCount = [
  body("courseId")
    .notEmpty()
    .withMessage("Please Enter the Course ID")
    .isNumeric()
    .withMessage("Please Enter the Valid Course ID")
    .custom((value) => {
      return CourseModel.findByPk(value).then((course) => {
        if (!course) {
          return Promise.reject("Course does not exists!");
        }
        return true;
      });
    }),
  body("termId")
    .notEmpty()
    .withMessage("Please Enter the Term ID")
    .isNumeric()
    .optional({ nullable: true })
    .withMessage("Please Enter the Valid Term ID")
    .custom((value) => {
      return CourseTermModel.findByPk(value).then((term) => {
        if (!term) {
          return Promise.reject("Term does not exists!");
        }
        return true;
      });
    }),
  body("flipped_concept")
    .notEmpty()
    .withMessage("Please Enter the Flipped Concept Count")
    .isNumeric()
    .withMessage("Please Enter the valid Flipped Concept Count"),
  body("flipped_practical")
    .notEmpty()
    .withMessage("Please Enter the Flipped Practical Count")
    .isNumeric()
    .withMessage("Please Enter the valid Flipped Practical Count"),
  body("live_concept")
    .notEmpty()
    .withMessage("Please Enter the Live Concept Count")
    .isNumeric()
    .withMessage("Please Enter the valid Flipped Concept Count"),
  body("live_practical")
    .notEmpty()
    .withMessage("Please Enter the Live Practical Count")
    .isNumeric()
    .withMessage("Please Enter the valid Flipped Concept Count"),
  body("assignments")
    .notEmpty()
    .withMessage("Please Enter the Assignments Count")
    .isNumeric()
    .withMessage("Please Enter the valid Assignments Count"),
];

const deleteContent = [
  param("id")
    .notEmpty()
    .withMessage("Please enter the content id")
    .isNumeric()
    .withMessage("Please enter the valid content id")
    .custom((value) => {
      return ContentModel.findByPk(value).then((content) => {
        if (!content) {
          return Promise.reject("Content does not exists!");
        }
        return true;
      });
    }),
];

const getAllContents = [
  body("courseId")
    .isNumeric()
    .optional()
    .withMessage("Please enter the valid course id")
    .custom((value) => {
      return CourseModel.findByPk(value).then((course) => {
        if (!course) {
          return Promise.reject("Course does not exists!");
        }
        return true;
      });
    }),
  body("termId")
    .isNumeric()
    .optional()
    .withMessage("Please Enter the Valid Term ID")
    .custom((value) => {
      return CourseTermModel.findByPk(value).then((term) => {
        if (!term) {
          return Promise.reject("Term does not exists!");
        }
        return true;
      });
    }),
  body("week").isNumeric().optional().withMessage("Please enter the valid week value"),
  body("status")
    .isIn(["Pending", "Not Applicable", "Not Uploaded", "Uploaded But Not Approved", "Approved"])
    .optional()
    .withMessage("Please enter the valid status"),
  body("pageNumber").isNumeric().optional().withMessage("Please enter the valid page number"),
  body("pageSize").isNumeric().optional().withMessage("Please enter the valid page size"),
];

const downloadContent = [
  body("courseId")
    .isNumeric()
    .withMessage("Please enter the valid course id")
    .custom((value) => {
      return CourseModel.findByPk(value).then((course) => {
        if (!course) {
          return Promise.reject("Course does not exists!");
        }
        return true;
      });
    }),
  body("termId")
    .isNumeric()
    .withMessage("Please Enter the Valid Term ID")
    .custom((value) => {
      return CourseTermModel.findByPk(value).then((term) => {
        if (!term) {
          return Promise.reject("Term does not exists!");
        }
        return true;
      });
    }),
  body("week").isNumeric().withMessage("Please enter the valid week value"),
  body("day").isNumeric().withMessage("Please enter the valid day value"),
  body("type")
    .isIn(["Flipped Concept", "Flipped Practical", "Live Concept", "Live Practical", "assignment"])
    .withMessage("Please enter the valid type"),
];

const getContentStatistics = [
  body("courseId")
    .isNumeric()
    .optional()
    .withMessage("Please enter the valid course id")
    .custom((value) => {
      return CourseModel.findByPk(value).then((course) => {
        if (!course) {
          return Promise.reject("Course does not exists!");
        }
        return true;
      });
    }),
  body("termId")
    .isNumeric()
    .optional()
    .withMessage("Please Enter the Valid Term ID")
    .custom((value) => {
      return CourseTermModel.findByPk(value).then((term) => {
        if (!term) {
          return Promise.reject("Term does not exists!");
        }
        return true;
      });
    }),
  body("week").optional().isNumeric().withMessage("Please enter the valid week value"),
  body("mentorId")
    .isNumeric()
    .optional()
    .withMessage("Please enter the valid mentor id")
    .custom((value) => {
      return UserModel.findByPk(value).then((user) => {
        if (!user) {
          return Promise.reject("Mentor does not exists!");
        }
        return true;
      });
    }),
  body("type")
    .isIn(["Flipped Concept", "Flipped Practical", "Live Concept", "Live Practical", "assignment"])
    .optional()
    .withMessage("Please enter the valid type"),
];

module.exports = {
  uploadTempResource,
  deleteTempResource,
  uploadResource,
  getDashboardData,
  getContentDetails,
  getMentorContents,
  saveContents,
  getContentCount,
  saveContentCount,
  deleteContent,
  getAllContents,
  downloadContent,
  getContentStatistics,
};
