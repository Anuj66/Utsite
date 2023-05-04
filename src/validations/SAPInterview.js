const { body, param }  = require("express-validator");
const moment = require("moment");
const { Op } = require("sequelize");
const DB = require('../models')
    
const scheduleInterview = [
    body('sapId').trim().notEmpty().withMessage('Invalid Student!'),
    body('interviewDate').trim('').notEmpty().withMessage('Please select interview date!').bail().isDate({format: 'DD/MM/YYYY'}).withMessage('Please select valid date!').bail(),
    body('interviewTime').trim().notEmpty().withMessage('Please select interview time!'),
    // .custom((value, {req}) => {
    //     return moment(`${req.body.interviewDate} ${value}`, 'DD/MM/YYYY hh:mm a').isValid()
    // }).withMessage('Please select valid time!'),
    body('interviewLink').trim().notEmpty().withMessage('Please enter interview link').bail().isURL().withMessage('Please enter valid interview link!')
]

const reScheduleInterview = [
    param('sapId').trim().notEmpty().withMessage('Invalid Student!'),
    body('interviewDate').trim('').notEmpty().withMessage('Please select interview date!').bail().isDate({format: 'DD/MM/YYYY'}).withMessage('Please select valid date!').bail(),
    body('interviewTime').trim().notEmpty().withMessage('Please select interview time!'),
    body('interviewLink').trim().notEmpty().withMessage('Please enter interview link').bail().isURL().withMessage('Please enter valid interview link!'),
    body('rescheduleReason').trim().notEmpty().withMessage('Please enter reschedule reason!')
]

module.exports = {
    scheduleInterview,
    reScheduleInterview
}