const { body }  = require("express-validator");

const register = [
    body('name').trim().notEmpty().withMessage('Name is required!'),
    body('email').trim().notEmpty().isEmail().withMessage('Invalid email address!'),
    body('mobile').trim().notEmpty().withMessage('Mobile number is required!').bail().isMobilePhone().withMessage('Invalid mobile number'),
    body('contest').notEmpty().withMessage('Contest is required!'),
]

const submit = [
    body('resourceLink').notEmpty().withMessage('Link is required!').bail().isURL().withMessage('Invalid URL!')
]

module.exports = {
    register,
    submit
}