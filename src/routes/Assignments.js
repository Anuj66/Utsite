const express = require('express')
const Assignments = require('../controller/Assignments')
const { validate } = require("../middleware/Validation");
const { saveStudentAssignment } = require('../validations/Assignments')

const router = new express.Router()

router.post('/', Assignments.getAll)
router.post('/saveStudentAssignment', validate(saveStudentAssignment), Assignments.createStudentAssignment)

module.exports = router;