const express = require('express')
const {validate} = require("../middleware/Validation")
const {register} = require("../validations/Webinar")
const Webinar = require('../controller/Webinar')

const router = new express.Router()

router.post('/', validate(register), Webinar.create)
router.get('/', Webinar.getAll)

module.exports = router;