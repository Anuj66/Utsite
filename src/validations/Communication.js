const { body, param } = require("express-validator");
const DB = require("../models");
const userRolesModel = DB.userRoles

const createCommunication = [
    body('communication').isArray({min:1}).withMessage('Please enter communications details!'),
    body('communication.*.roleId').notEmpty().withMessage('Please select reveiver role!'),
    body('communication.*.status').notEmpty().withMessage('Please select message status!').isBoolean().withMessage('status should be in boolen!'),
    body('communication.*.message').exists().withMessage('Please enter message!'),
]

const fetchByRole = [
    param('roleId').notEmpty().withMessage('Please select user role!').custom((value) => {
        
        if(value === "-1"){
            return true
        }
        return userRolesModel.findOne({
            where:{
                id: value
            }
        }).then(res => {
            if (res) {
                return true;
            }
            return Promise.reject("User role does not exists!");
        })
    })
]

module.exports = {
    createCommunication,
    fetchByRole
}
