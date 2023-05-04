const express = require('express')
const Classes = require("../controller/Class")
const { saveClassLink, getMentorClassesDetails } = require('../validations/Class')
const { validate } = require("../middleware/Validation");

const router = new express.Router()

router.post('/saveClassLink/:id', validate(saveClassLink), Classes.saveClassLinkById)
router.post('/getClassDetails', validate(getMentorClassesDetails) , Classes.getMentorClassesDetails)

module.exports = router;