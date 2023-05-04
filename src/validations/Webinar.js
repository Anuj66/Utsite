const { body }  = require("express-validator");

const register = [
    body('name').trim().notEmpty().withMessage('Please enter name!'),
    body('email').trim().notEmpty().withMessage('Please enter email address!').bail().isEmail().withMessage('Please enter valid email address!'),
    body('mobile').trim().notEmpty().withMessage('Please enter mobile number!').bail().isMobilePhone().withMessage('Please enter valid mobile number!'),
    body('city').trim().notEmpty().withMessage('Please enter city!'),
    body('course').notEmpty().withMessage('Please select area of interest!'),
    body('weinardatetime').notEmpty().withMessage('Please select webinar date & slot!'),
]

module.exports = {
    register
}