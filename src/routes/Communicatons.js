const express = require('express')
const Communication = require('../controller/Communications')
const HasRole  = require('../middleware/HasRole')
const {validate} = require("../middleware/Validation")
const { createCommunication, fetchByRole } = require("../validations/Communication")

const router = new express.Router()

router.post('/', HasRole.isSuperadmin, validate(createCommunication), Communication.create)
router.get('/', HasRole.isSuperadmin, Communication.getAll)
router.get('/getByRole/:roleId', validate(fetchByRole) ,Communication.fetchByRole)

module.exports = router;