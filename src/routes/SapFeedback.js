const express = require('express')
const {validate} = require("../middleware/Validation")
const {addFeedback, updateFeedback, finalFeedback} = require("../validations/SAPFeedback")
const sapFeedback = require('../controller/SapFeedback')

const router = new express.Router()

// router.post('/', validate(addFeedback), sapFeedback.addFeedback)
router.post('/', sapFeedback.addFeedback)
router.get('/:sapId', sapFeedback.getSapFeedback)
// router.put('/:sapId', validate(updateFeedback), sapFeedback.updateFeedback)
router.put('/:sapId', sapFeedback.updateFeedback)
router.get('/feedback-params/:courseId', sapFeedback.getParamsList)
router.post('/final-feedback/:sapId', validate(finalFeedback), sapFeedback.addFinalFeedback)

module.exports = router;