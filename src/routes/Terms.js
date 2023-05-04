const express = require('express')
const Terms = require('../controller/Terms')
const {validate} = require("../middleware/Validation")
const { createTerm, updateTerm, fetchTerm, deleteTerm } = require("../validations/courseTerms")

const router = new express.Router()

router.post('/', validate(createTerm), Terms.create)
router.get("/:termId", validate(fetchTerm), Terms.getByID)
router.put('/:termId', validate(updateTerm), Terms.update)
router.delete("/:termId", validate(deleteTerm), Terms.remove)
router.post('/get-list', Terms.getAll)

module.exports = router;