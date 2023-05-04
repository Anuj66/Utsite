const express = require('express')
const {validate} = require("../middleware/Validation")
const validations = require("../validations/SAPInterview")
const SapInterviews = require('../controller/SapInterviews')

const router = new express.Router()

router.post('/', validate(validations.scheduleInterview), SapInterviews.addInterview)
router.get('/:sapId', SapInterviews.getDetails)
router.put('/:sapId', validate(validations.reScheduleInterview), SapInterviews.reScheduleInterview)

module.exports = router;