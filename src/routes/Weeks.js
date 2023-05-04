const express = require('express')
const Weeks = require('../controller/Weeks')

const router = new express.Router()

router.post('/', Weeks.getWeeks)

module.exports = router;