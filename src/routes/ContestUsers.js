const express = require('express')
const {validate} = require("../middleware/Validation")
const {register, submit} = require("../validations/Contest")
const Users = require('../controller/ContestUsers')

const router = new express.Router()

router.post('/', validate(register), Users.create)
router.get('/:token', Users.getByToken)
router.put('/:contestId', Users.update)
router.get('/', Users.getAll)

module.exports = router;