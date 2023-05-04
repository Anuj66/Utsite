const express = require('express')
const Public = require("../controller/Public")
const states = require("../controller/States")
const cities = require("../controller/Cities")
const courses = require("../controller/Courses")

const router = new express.Router()

router.get('/countries', Public.getCountryList)
router.get('/states/', states.getAll);
router.get('/states/:countryId', states.getAll);
router.get('/cities/:stateId', cities.getAll);
router.get('/courses-list/',  courses.getList);

module.exports = router;