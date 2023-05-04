const express = require('express')
const Courses = require('../controller/Courses')
const {validate} = require("../middleware/Validation")
const UploadFile = require("../middleware/UploadFile")
const { createCourse, updateCourse, fetchCourse, deleteCourse } = require('../validations/Courses')

const router = new express.Router()

router.post('/', UploadFile.uploadAny.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'promotionalVideo', maxCount: 1}]), validate(createCourse), Courses.create)
router.put('/:courseId', UploadFile.uploadAny.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'promotionalVideo', maxCount: 1}]), validate(updateCourse), Courses.update)
router.get("/:courseId", validate(fetchCourse), Courses.getByID)
router.delete("/:courseId", validate(deleteCourse), Courses.remove)
router.post('/get-list', Courses.getAll)
router.get("/:courseId/mentors", Courses.getCourseMentors)

module.exports = router;