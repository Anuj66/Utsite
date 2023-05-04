const { body }  = require("express-validator");

const sendOTPRules = [
    body('mobileNo').trim().notEmpty().isMobilePhone().withMessage('Invalid Mobile Number!'),
]

const assignMentorRules = [
    body('apps').notEmpty().withMessage('Please select applications!'),
]

module.exports = {
    sendOTPRules,
    assignMentorRules
}