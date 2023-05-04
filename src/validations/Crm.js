const { body }  = require("express-validator");

const crmRules = [
    body('name').trim().notEmpty().withMessage('Name is required!'),
    body('email_address').trim().notEmpty().isEmail().withMessage('Invalid Email Address!'),
    body('mobile').trim().notEmpty().isMobilePhone().withMessage('Invalid Mobile Number'),
    body('state').notEmpty(),
    body('city').notEmpty(),
    body('course').notEmpty()
]

module.exports = {
    crmRules
}