const DB = require("../models");
const {Op} = require("sequelize");
const ResponseFormatter = require("../utils/ResponseFormatter");
const {paginate, groupByFields} = require("../utils/DataManipulation");
const {contentStatuses, mentorRoleId} = require("../config/siteConfig");
const {moveFile, removeFile} = require("../utils/FileSystem");
const {userHasRole} = require("../utils/Users");
const sequelize = require("sequelize");
const {uploadBasePath} = require("../config/siteConfig");
const fs = require("fs");
const AdmZip = require("adm-zip");

const ContentModel = DB.content;
const CourseModel = DB.courses;
const AssignmentsModel = DB.assignments;
const CourseTermsModel = DB.courseTerms;
const CourseWeeksModel = DB.courseWeeks;
const ContentCountModel = DB.content_count;
const contentPath = "class_resourses/contents";
const assignmentPath = "class_resourses/assignments";

const getStatusList = async (req, res) => {
    return res
        .status(200)
        .json(
            ResponseFormatter.setResponse(true, 200, "Content Status List", "Success", contentStatuses)
        );
};

// upload content from popup for displaying progress
const uploadResource = async (req, res) => {
    try {
        const {courseId, termId, week, content_type, day} = req.body;

        console.log("Mentor ID: ", req.user.id)

        // Save Assignments
        if (content_type === "assignment") {
            moveFile(req.file.filename, `${assignmentPath}/${req.file.filename}`);
            const uploadedByMentor = await userHasRole(req.user.id, mentorRoleId);
            const assignment = await AssignmentsModel.create({
                courseId: courseId,
                termId: termId,
                week: week,
                attachment: `${assignmentPath}/${req.file.filename}`,
                status: "Pending",
                createdBy: req.user.id,
                uploadedByMentor: uploadedByMentor,
            });

            return res
                .status(200)
                .json(
                    ResponseFormatter.setResponse(true, 200, "Content uploaded successfully.", "", assignment)
                );
        } else {
            moveFile(req.file.filename, `${contentPath}/${req.file.filename}`);
            const uploadedByMentor = await userHasRole(req.user.id, mentorRoleId);
            const content = await ContentModel.create({
                courseId: courseId,
                termId: termId,
                week: week,
                type: content_type,
                attachment: `${contentPath}/${req.file.filename}`,
                status: "Pending",
                day: day,
                uploadedByMentor: uploadedByMentor,
                createdBy: req.user.id,
            });

            return res
                .status(200)
                .json(
                    ResponseFormatter.setResponse(true, 200, "Content uploaded successfully.", "", content)
                );
        }
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .json(
                ResponseFormatter.setResponse(false, 400, "Something Went Wrong", "error", error.message)
            );
    }
};

//delete content on press cancel uploaded files
const deleteTempResources = async (req, res) => {
    const {contentIds, content_type} = req.body;

    try {
        if (content_type === "assignment") {
            const Assignments = await AssignmentsModel.findAll({
                attributes: ["attachment"],
                where: {
                    id: {
                        [Op.in]: contentIds,
                    },
                },
            });

            await Promise.all(
                Assignments.map(async (assignment) => {
                    await removeFile(assignment.attachment);
                })
            );

            await AssignmentsModel.destroy({
                where: {
                    id: {
                        [Op.in]: contentIds,
                    },
                },
                force: true,
            });
            console.log("ds");
        } else {
            const contents = await ContentModel.findAll({
                attributes: ["attachment"],
                where: {
                    id: {
                        [Op.in]: contentIds,
                    },
                },
            });

            await Promise.all(
                contents.map(async (content) => {
                    await removeFile(content.attachment);
                })
            );

            await ContentModel.destroy({
                where: {
                    id: {
                        [Op.in]: contentIds,
                    },
                },
                force: true,
            });
        }

        return res
            .status(200)
            .json(
                ResponseFormatter.setResponse(true, 200, "Content deleted successfully", "success", [])
            );
    } catch (error) {
        return res
            .status(400)
            .json(
                ResponseFormatter.setResponse(false, 400, "Something Went Wrong", "error", error.message)
            );
    }
};

// upload all uploaded content on click of upload button on popup
const uploadContent = async (req, res) => {
    const {contentDetails} = req.body;
    const uploadedByMentor = await userHasRole(req.user.id, mentorRoleId);
    try {
        const contents = await Promise.all(
            contentDetails.map(async (contentDetail) => {
                const content_type = contentDetail.content_type;
                if (content_type === "assignment") {
                    if (contentDetail.id == -1) {
                        return await AssignmentsModel.create({
                            courseId: contentDetail.courseId,
                            termId: contentDetail.termId,
                            week: contentDetail.week,
                            attachment: "",
                            status: contentDetail.isNotApplicable ? "Not Applicable" : contentDetail.status,
                            createdBy: req.user.id,
                            uploadedByMentor: uploadedByMentor,
                        });
                    } else {
                        await AssignmentsModel.update(
                            {
                                description: contentDetail.description,
                                status: contentDetail.isNotApplicable ? "Not Applicable" : contentDetail.status,
                                isApplicable: !contentDetail.isNotApplicable,
                                order: contentDetail.order,
                            },
                            {
                                where: {
                                    id: contentDetail.id,
                                },
                            }
                        );
                        return await AssignmentsModel.findByPk(contentDetail.id);
                    }
                } else {
                    if (contentDetail.id == -1) {
                        return await ContentModel.create({
                            courseId: contentDetail.courseId,
                            termId: contentDetail.termId,
                            week: contentDetail.week,
                            attachment: "",
                            status: contentDetail.isNotApplicable ? "Not Applicable" : contentDetail.status,
                            createdBy: req.user.id,
                            type: content_type,
                            isApplicable: !contentDetail.isNotApplicable,
                            day: contentDetail.day,
                            uploadedByMentor: uploadedByMentor,
                        });
                    } else {
                        await ContentModel.update(
                            {
                                description: contentDetail.description,
                                status: contentDetail.isNotApplicable ? "Not Applicable" : contentDetail.status,
                                isApplicable: !contentDetail.isNotApplicable,
                                order: contentDetail.order,
                                type: content_type,
                                day: contentDetail.day,
                            },
                            {
                                where: {
                                    id: contentDetail.id,
                                },
                            }
                        );
                        return await ContentModel.findByPk(contentDetail.id);
                    }
                }
            })
        );

        return res
            .status(200)
            .json(
                ResponseFormatter.setResponse(
                    true,
                    200,
                    "Content uploaded successfully",
                    "success",
                    contents
                )
            );
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .json(
                ResponseFormatter.setResponse(false, 400, "Something Went Wrong", "error", error.message)
            );
    }
};

// delete content from upload content screen
const deleteResources = async (req, res) => {
    const {contentIds, content_type} = req.body;

    try {
        if (content_type === "assignment") {
            await AssignmentsModel.destroy({
                where: {
                    id: {
                        [Op.eq]: contentIds,
                    },
                },
            });
        } else {
            await ContentModel.destroy({
                where: {
                    id: {
                        [Op.eq]: contentIds,
                    },
                },
            });
        }

        return res
            .status(200)
            .json(
                ResponseFormatter.setResponse(true, 200, "Content deleted successfully", "success", [])
            );
    } catch (error) {
        return res
            .status(400)
            .json(
                ResponseFormatter.setResponse(false, 400, "Something Went Wrong", "error", error.message)
            );
    }
};

/* get all content for content details page */
const getAllContent = async (req, res) => {
    try {
        const {courseId, termId, week, mentorId, perpage, currentPage} = req.body;

        const isMentorLoggedIn = await userHasRole(req.user.id, mentorRoleId);

        let filterBy = {};

        filterBy.attachment = {
            [Op.ne]: "",
            [Op.ne]: null,
        };

        if (courseId && courseId != "") {
            filterBy.courseId = {
                [Op.eq]: courseId,
            };
        }

        if (week && week != "") {
            filterBy.week = {
                [Op.eq]: week,
            };
        }

        if (termId && termId != "") {
            filterBy.termId = {
                [Op.eq]: termId,
            };
        }

        if (mentorId && mentorId != "") {
            filterBy.createdBy = {
                [Op.eq]: mentorId,
            };
        }

        if (isMentorLoggedIn) {
            filterBy.createdBy = {
                [Op.eq]: req.user.id,
            };
        }

        const {count: contentCount, rows: contents} = await ContentModel.findAndCountAll({
            where: filterBy,
        });

        const {count: assignmentCount, rows: assignments} = await AssignmentsModel.findAndCountAll({
            where: filterBy,
        });

        let contentList = [];
        for (const content of contents) {
            contentList.push(content);
        }
        for (const assignment of assignments) {
            contentList.push(assignment);
        }

        const response = {
            totalRows: assignmentCount + contentCount,
            data: {...contentList},
        };

        return res
            .status(200)
            .json(ResponseFormatter.setResponse(true, 200, "List of all Content", "Success", response));
    } catch (error) {
        return res
            .status(400)
            .json(
                ResponseFormatter.setResponse(false, 400, "Something went wrong", "Error", error.message)
            );
    }
};

const getStatistics = async (req, res) => {
    try {
        const {courseId, termId, week, mentorId, status, currentPage = 1, perPage = 10} = req.body;

        let filterBy = {};

        filterBy.attachment = {
            [Op.ne]: "",
            [Op.ne]: null,
        };

        if (courseId && courseId != "") {
            filterBy.courseId = {
                [Op.eq]: courseId,
            };
        }

        if (week && week != "") {
            filterBy.week = {
                [Op.eq]: week,
            };
        }

        if (termId && termId != "") {
            filterBy.termId = {
                [Op.eq]: termId,
            };
        }

        if (mentorId && mentorId != "") {
            filterBy.createdBy = {
                [Op.eq]: mentorId,
            };
        }

        if (status && status != "") {
            filterBy.status = {
                [Op.eq]: status,
            };
        }

        let contents = []

        contents = await ContentModel.findAll({
            attributes: [
                "courseId",
                "termId",
                "week",
                "type",
                [sequelize.fn("count", "*"), "recCount"],
                "status",
            ],
            where: filterBy,
            group: ["courseId", "termId", "week", "type"],
            include: [
                {
                    model: CourseModel,
                    attributes: ["title", "id"],
                },
                {
                    model: CourseTermsModel,
                    attributes: ["TermTitle", "termNo", "id"],
                },
            ],
        });

        const assignments = await AssignmentsModel.findAll({
            attributes: [
                "courseId",
                "termId",
                "week",
                [sequelize.fn("count", "*"), "recCount"],
                "status",
            ],
            where: filterBy,
            group: ["courseId", "termId", "week"],
            include: [
                {
                    model: CourseModel,
                    attributes: ["title", "id"],
                },
                {
                    model: CourseTermsModel,
                    attributes: ["TermTitle", "termNo", "id"],
                },
            ]
        });

        for (const assignment of assignments) {
            assignment.type = "Assignment";
            contents.push(assignment);
        }

        let result = groupByFields(contents, function (item) {
            return [item.courseId, item.termId, item.week];
        });

        let response = [];

        for (const data of result) {
            let tempData = {
                course: data[0].course ? data[0].course.title : null,
                courseId: data[0].course ? data[0].course.id : null,
                term: data[0].courseTerm ? data[0].courseTerm.TermTitle : null,
                termNo: data[0].courseTerm ? data[0].courseTerm.termNo : null,
                termId: data[0].courseTerm ? data[0].courseTerm.id : null,
                week: data[0].week,
                states: [
                    {
                        type: "Flipped Concept",
                        recCount: 0,
                        status: "Not Uploaded",
                    },
                    {
                        type: "Flipped Practical",
                        recCount: 0,
                        status: "Not Uploaded",
                    },
                    {
                        type: "Live Concept",
                        recCount: 0,
                        status: "Not Uploaded",
                    },
                    {
                        type: "Live Practical",
                        recCount: 0,
                        status: "Not Uploaded",
                    },
                    {
                        type: "assignment",
                        recCount: 0,
                        status: "Not Uploaded",
                    },
                ],
            };
            for (const state of data) {
                if (state.type === "assignment") {
                    tempData.states[4] = {
                        type: "assignment",
                        recCount: state.dataValues.recCount,
                        status: state.status,
                    };
                } else if (state.type === "Flipped Concept") {
                    tempData.states[0] = {
                        type: state.type,
                        recCount: state.dataValues.recCount,
                        status: state.status,
                    };
                } else if (state.type === "Flipped Practical") {
                    tempData.states[1] = {
                        type: state.type,
                        recCount: state.dataValues.recCount,
                        status: state.status,
                    };
                } else if (state.type === "Live Concept") {
                    tempData.states[2] = {
                        type: state.type,
                        recCount: state.dataValues.recCount,
                        status: state.status,
                    };
                } else if (state.type === "Live Practical") {
                    tempData.states[3] = {
                        type: state.type,
                        recCount: state.dataValues.recCount,
                        status: state.status,
                    };
                }
            }
            response.push(tempData);
        }

        const totalRecs = response.length

        response = paginate(response, perPage, currentPage)

        return res
            .status(200)
            .json(ResponseFormatter.setResponse(true, 200, "List of all Content", "Success", {
                totalRecs,
                data: response
            }));
    } catch (error) {
        return res
            .status(400)
            .json(
                ResponseFormatter.setResponse(false, 400, "Something went wrong", "Error", error.message)
            );
    }
};

const dashboardData = async (req, res, next) => {
    try {
        let result = [];
        const {week, termNo} = req.body;

        let termFilter = {};

        if (termNo && termNo != '') {
            termFilter.termNo = {
                [Op.eq]: termNo
            }
        }

        // Getting all courses
        const courses = await CourseModel.findAll({
            include: [
                {
                    model: CourseTermsModel,
                    where: termFilter,
                    attributes: ["id"],
                },
            ],
        });

        let filterBy = {};
        let summaryFilter = {};

        if (week && week != "") {
            filterBy.week = {
                [Op.eq]: week,
            };
        }

        for (const course of courses) {
            let termIds = [];
            for (const term of course.courseTerms) {
                termIds.push(term.id);
            }

            filterBy.courseId = {
                [Op.eq]: course.id,
            };

            filterBy.termId = {
                [Op.in]: termIds,
            };

            filterBy.attachment = {
                [Op.ne]: "",
                [Op.ne]: null,
            };

            let contents = await ContentModel.findAll({
                where: filterBy,
            });

            let published = {
                flipped_content: 0,
                live_class_concept: 0,
                live_class_practical: 0,
                flipped_content_practical: 0,
                assignments: 0,
            };
            let pending = {
                flipped_content: 0,
                live_class_concept: 0,
                live_class_practical: 0,
                flipped_content_practical: 0,
                assignments: 0,
            };
            let total = {
                flipped_content: 0,
                live_class_concept: 0,
                live_class_practical: 0,
                flipped_content_practical: 0,
                assignments: 0,
            };
            let summary = {
                flipped_content: 0,
                live_class_concept: 0,
                live_class_practical: 0,
                flipped_content_practical: 0,
                assignments: 0,
            };

            // Getting content and applying checks
            contents.forEach((content) => {
                const type = content.dataValues.type;
                const status = content.dataValues.status;
                if (status != "Approved") {
                    if (type === "Flipped Concept") {
                        pending.flipped_content = pending.flipped_content + 1;
                    } else if (type === "Flipped Practical") {
                        pending.flipped_content_practical = pending.flipped_content_practical + 1;
                    } else if (type === "Live Concept") {
                        pending.live_class_concept = pending.live_class_concept + 1;
                    } else {
                        pending.live_class_practical = pending.live_class_practical + 1;
                    }
                } else {
                    if (type === "Flipped Concept") {
                        published.flipped_content = published.flipped_content + 1;
                    } else if (type === "Flipped Practical") {
                        published.flipped_content_practical = published.flipped_content_practical + 1;
                    } else if (type === "Live Concept") {
                        published.live_class_concept = published.live_class_concept + 1;
                    } else {
                        published.live_class_practical = published.live_class_practical + 1;
                    }
                }
                if (type === "Flipped Concept") {
                    total.flipped_content = total.flipped_content + 1;
                } else if (type === "Flipped Practical") {
                    total.flipped_content_practical = total.flipped_content_practical + 1;
                } else if (type === "Live Concept") {
                    total.live_class_concept = total.live_class_concept + 1;
                } else {
                    total.live_class_practical = total.live_class_practical + 1;
                }
            });

            let assignments = await AssignmentsModel.findAll({
                where: filterBy,
            });

            //Getting All assignments w.r.t course
            assignments.forEach((assignment) => {
                const status = assignment.dataValues.status;
                if (status != "Approved") {
                    pending.assignments = pending.assignments + 1;
                } else {
                    published.assignments = published.assignments + 1;
                }
                total.assignments = total.assignments + 1;
            });

            summaryFilter.courseId = {
                [Op.eq]: course.id,
            };

            summaryFilter.termId = {
                [Op.in]: termIds,
            };

            //Getting ContentCount i.e. Summary
            const contentCount = await ContentCountModel.findAll({
                where: summaryFilter,
            });

            for (const summaryData of contentCount) {
                summary.flipped_content += summaryData.flipped_concept;
                summary.flipped_content_practical += summaryData.flipped_practical;
                summary.live_class_concept += summaryData.live_concept;
                summary.live_class_practical += summaryData.live_practical;
                summary.assignments += summaryData.assignments;
            }

            result.push({
                course: course.dataValues.title,
                published: published,
                pending: pending,
                total: total,
                summary: summary,
            });
        }

        return res
            .status(200)
            .json(ResponseFormatter.setResponse(true, 200, "API hit successfully", "success", result));
    } catch (error) {
        return res
            .status(400)
            .json(
                ResponseFormatter.setResponse(false, 400, "Something Went Wrong", "Error", error.message)
            );
    }
};

/****MAY BE GRABAGE  CODE */
const contentDetails = async (req, res, next) => {
    try {
        let responseData = {};
        let result = [];

        let {courseId, termId, weekId, status, pageNumber, pageSize} = req.query;

        if (!pageSize) pageSize = 10;

        if (!pageNumber) pageNumber = 1;

        //Getting all the courses from courses table
        let courses = [];
        if (courseId) {
            courses = await CourseModel.findAndCountAll({
                where: {id: courseId},
            });
        } else {
            courses = await CourseModel.findAndCountAll({
                where: {},
            });
        }

        for (const course of courses.rows) {
            //Getting all the terms from courseTerms Table
            let terms = [];
            if (termId) {
                terms = await CourseTermsModel.findAndCountAll({
                    where: {
                        courseId: course.dataValues.id,
                        id: termId,
                    },
                });
            } else {
                terms = await CourseTermsModel.findAndCountAll({
                    where: {courseId: course.dataValues.id},
                });
            }

            for (const term of terms.rows) {
                // //Getting all the weeks from the courseWeeks Table
                // let weeks = [];
                // if (weekId) {
                //   weeks = await CourseWeeksModel.findAndCountAll({
                //     where: {
                //       courseId: course.dataValues.id,
                //       termId: term.dataValues.id,
                //       id: weekId,
                //     },
                //   });
                // } else {
                //   weeks = await CourseWeeksModel.findAndCountAll({
                //     where: {
                //       courseId: course.dataValues.id,
                //       termId: term.dataValues.id,
                //     },
                //   });
                // }

                for (const week of weeks.rows) {
                    //Getting Contents w.r.t week, term, course
                    let contents = [];
                    if (status) {
                        contents = await ContentModel.findAndCountAll({
                            where: {
                                courseId: course.dataValues.id,
                                termId: term.dataValues.id,
                                week: week.dataValues.id,
                                status: status,
                            },
                        });
                    } else {
                        contents = await ContentModel.findAndCountAll({
                            where: {
                                courseId: course.dataValues.id,
                                termId: term.dataValues.id,
                                weekId: week.dataValues.id,
                            },
                        });
                    }

                    let data = {
                        flipped_content: 0,
                        flipped_content_type: status ? status : "Not Applicable",
                        live_class_concept: 0,
                        live_class_concept_type: status ? status : "Not Applicable",
                        live_class_practical: 0,
                        live_class_practical_type: status ? status : "Not Applicable",
                        flipped_content_practical: 0,
                        flipped_content_practical_type: status ? status : "Not Applicable",
                        assignments: 0,
                        assignments_type: status ? status : "Not Applicable",
                    };

                    for (const content of contents.rows) {
                        const type = content.dataValues.type;
                        if (type === "Flipped Concept") {
                            data.flipped_content = data.flipped_content + 1;
                            data.flipped_content_type = content.dataValues.status;
                        }
                        if (type === "Flipped Practical") {
                            data.flipped_content_practical = data.flipped_content_practical + 1;
                            data.flipped_content_practical_type = content.dataValues.status;
                        }
                        if (type === "Live Concept") {
                            data.live_class_concept = data.live_class_concept + 1;
                            data.live_class_concept_type = content.dataValues.status;
                        }
                        if (type === "Live Practical") {
                            data.live_class_practical = data.live_class_practical + 1;
                            data.live_class_practical_type = content.dataValues.status;
                        }
                    }

                    // Getting Assigments w.r.t Course, Term, Week, Status(optional)
                    let assignments = [];
                    if (status) {
                        assignments = await AssignmentsModel.findAndCountAll({
                            where: {
                                courseId: course.dataValues.id,
                                termId: term.dataValues.id,
                                weekId: week.dataValues.id,
                                status: status,
                            },
                        });
                    } else {
                        assignments = await AssignmentsModel.findAndCountAll({
                            where: {
                                courseId: course.dataValues.id,
                                termId: term.dataValues.id,
                                weekId: week.dataValues.id,
                            },
                        });
                    }

                    for (const assignment of assignments.rows) {
                        data.assignments = data.assignments + 1;
                        data.assignments_type = assignment.dataValues.status;
                    }

                    result.push({
                        course: course.dataValues.title,
                        term: term.dataValues.termNo,
                        week: week.dataValues.weekNo,
                        flipped_content: data.flipped_content,
                        flipped_content_type: data.flipped_content_type,
                        flipped_content_practical: data.flipped_content_practical,
                        flipped_content_practical_type: data.flipped_content_practical_type,
                        live_class_concept: data.live_class_concept,
                        live_class_concept_type: data.live_class_concept_type,
                        live_class_practical: data.live_class_practical,
                        live_class_practical_type: data.live_class_practical_type,
                        assignments: data.assignments,
                        assignments_type: data.assignments_type,
                    });
                }
            }
        }

        const totalRecs = result.length;

        // Pagination
        result = paginate(result, pageSize, pageNumber);

        responseData = {
            totalRecs: totalRecs,
            contents: result,
        };

        return res
            .status(200)
            .json(ResponseFormatter.setResponse(true, 200, "Content Details", "success", responseData));
    } catch (error) {
        return res
            .status(400)
            .json(
                ResponseFormatter.setResponse(false, 400, "Something went wrong", "error", error.message)
            );
    }
};

const getMentorContents = async (req, res, next) => {
    try {
        const {courseId, termId, weekId} = req.query;

        let responseData = {};

        // Getting course from courseId
        const course = await CourseModel.findOne({
            where: {id: courseId},
        });

        // Getting Course Terms
        let terms = [];
        if (termId) {
            terms = await CourseTermsModel.findAndCountAll({
                where: {
                    id: termId,
                    courseId: courseId,
                },
            });
        } else {
            terms = await CourseTermsModel.findAndCountAll({
                where: {
                    courseId: courseId,
                },
            });
        }

        let resultData = [];

        for (const term of terms.rows) {
            // Getting Course Weeks
            let weeks = [];
            if (weekId) {
                weeks = await CourseWeeksModel.findAndCountAll({
                    where: {
                        id: weekId,
                        courseId: courseId,
                        termId: term.dataValues.id,
                    },
                });
            } else {
                weeks = await CourseWeeksModel.findAndCountAll({
                    where: {
                        courseId: courseId,
                        termId: term.dataValues.id,
                    },
                });
            }

            for (const week of weeks.rows) {
                // Getting Content w.r.t week and term
                const contents = await ContentModel.findAndCountAll({
                    where: {
                        courseId: courseId,
                        termId: term.dataValues.id,
                        weekId: week.dataValues.id,
                    },
                });

                let contentData = {
                    flipped_content_concept: "Not Applicable",
                    flipped_content_practical: "Not Applicable",
                    live_class_concept: "Not Applicable",
                    live_class_practical: "Not Applicable",
                    assignment: "Not Applicable",
                };

                for (const content of contents.rows) {
                    const contentType = content.dataValues.type;
                    const contentEvaluationStatus = content.dataValues.evaluationStatus;
                    if (contentType === "Flipped Practical") {
                        contentData.flipped_content_practical = contentEvaluationStatus;
                    }
                    if (contentType === "Flipped Concept") {
                        contentData.flipped_content_concept = contentEvaluationStatus;
                    }
                    if (contentType === "Live Practical") {
                        contentData.live_class_practical = contentEvaluationStatus;
                    }
                    if (contentType === "Live Concept") {
                        contentData.live_class_concept = contentEvaluationStatus;
                    }
                }

                // Getting Assignments
                const assignments = await AssignmentsModel.findAndCountAll({
                    where: {
                        courseId: courseId,
                        termId: term.dataValues.id,
                        weekId: week.dataValues.id,
                    },
                });

                for (const assignment of assignments.rows) {
                    const assignmentStatus = await MentorAssignmentModel.findOne({
                        where: {
                            assignmentId: assignment.dataValues.id,
                        },
                        attributes: ["evaluationStatus"],
                    });
                    if (assignmentStatus) {
                        contentData.assignment = assignmentStatus.evaluationStatus;
                    }
                }

                resultData.push({
                    term: term.dataValues.termNo,
                    week: week.dataValues.weekNo,
                    contentDetail: contentData,
                });
            }
        }

        responseData = {
            course: course.dataValues.title,
            terms: resultData,
        };

        return res
            .status(200)
            .json(ResponseFormatter.setResponse(true, 200, "Course Listed", "success", responseData));
    } catch (error) {
        return res
            .status(400)
            .json(
                ResponseFormatter.setResponse(false, 400, "Something Went Wrong", "error", error.message)
            );
    }
};
/****MAY BE GRABAGE  CODE  END*/

/**Author: Anuj WTS */
const getContentCount = async (req, res, next) => {
    try {
        // await saveContentCount();

        let response = {
            flipped_concept: 0,
            flipped_practical: 0,
            live_concept: 0,
            live_practical: 0,
            assignments: 0,
        };

        const {courseId, termId} = req.body;

        let filterBy = {};

        if (courseId && courseId != "") {
            filterBy.courseId = {
                [Op.eq]: courseId,
            };
        }

        if (termId && termId != "") {
            filterBy.termId = {
                [Op.eq]: termId,
            };
        }

        const contentCounts = await ContentCountModel.findAll({
            where: filterBy,
        });

        for (const contentCount of contentCounts) {
            response.flipped_concept += contentCount.flipped_concept;

            response.flipped_practical += contentCount.flipped_practical;

            response.live_concept += contentCount.live_concept;

            response.live_practical += contentCount.live_practical;

            response.assignments += contentCount.assignments;
        }

        return res
            .status(200)
            .json(ResponseFormatter.setResponse(true, 200, "Content Count Listed", "success", response));
    } catch (error) {
        return res
            .status(400)
            .json(
                ResponseFormatter.setResponse(false, 400, "Something went wrong", "error", error.message)
            );
    }
};

const saveContentCount = async (req, res, next) => {
    try {
        const {
            courseId,
            termId,
            flipped_concept,
            flipped_practical,
            live_concept,
            live_practical,
            assignments,
        } = req.body;

        const contentExists = await ContentCountModel.findOne({
            where: {
                courseId: courseId,
                termId: termId,
            },
        });

        let dataToSave = {
            courseId,
            termId,
            flipped_concept,
            flipped_practical,
            live_concept,
            live_practical,
            assignments,
            createdBy: req.user.id,
            updatedBy: req.user.id,
        };

        if (contentExists) {
            dataToSave = {id: contentExists.id, ...dataToSave};
        }

        const savedData = await ContentCountModel.upsert(dataToSave);

        return res
            .status(200)
            .json(
                ResponseFormatter.setResponse(
                    true,
                    200,
                    "Content Count Saved Successfully",
                    "success",
                    savedData
                )
            );
    } catch (error) {
        return res
            .status(400)
            .json(
                ResponseFormatter.setResponse(false, 400, "Something Went Wrong", "error", error.message)
            );
    }
};

const deleteContent = async (req, res, next) => {
    try {
        const id = req.params.id;

        const deletedContent = await ContentModel.destroy({
            where: {
                id: id,
            },
        });

        return res
            .status(200)
            .json(
                ResponseFormatter.setResponse(
                    true,
                    200,
                    "Content Deleted Successfully",
                    "success",
                    deletedContent
                )
            );
    } catch (erorr) {
        return res
            .status(400)
            .json(
                ResponseFormatter.setResponse(false, 400, "Something went wrong", "error", error.message)
            );
    }
};

const downloadContent = async (req, res, next) => {
    try {
        const {courseId, termId, week, type, day} = req.body;

        const zip = new AdmZip();

        let contents = [];

        if (type != "assignment") {
            contents = await ContentModel.findAll({
                where: {
                    courseId: courseId,
                    termId: termId,
                    week: week,
                    type: type,
                    day: day,
                },
            });
        } else {
            contents = await AssignmentsModel.findAll({
                where: {
                    courseId: courseId,
                    termId: termId,
                    week: week,
                },
            });
        }

        if (contents.length > 0) {
            for (const content of contents) {
                if (content.attachment) {
                    const file = uploadBasePath + "/" + content.attachment;
                    zip.addLocalFile(file);
                }
            }
        } else {
            return res.status(200).json(ResponseFormatter.setResponse("true", 200, "No Content Found", "success"))
        }


        const zipContents = zip.toBuffer();

        const fileName = "uploads.zip";
        const fileType = "application/zip";

        res.writeHead(200, {
            "Content-Disposition": `attachment; filename="${fileName}"`,
            "Content-Type": fileType,
        });

        return res.end(zipContents);
    } catch (error) {
        return res
            .status(400)
            .json(
                ResponseFormatter.setResponse(false, 400, "File not Found", "error", error.message)
            );
    }
};

module.exports = {
    getStatusList,
    uploadResource,
    uploadContent,
    deleteTempResources,
    deleteResources,
    getAllContent,
    getStatistics,
    dashboardData,
    getContentCount,
    saveContentCount,
    contentDetails,
    deleteContent,
    downloadContent,
};
