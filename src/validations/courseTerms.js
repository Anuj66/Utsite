const { body, param } = require("express-validator");
const { Op } = require("sequelize");
const DB = require('../models')

const courseTermsModel = DB.courseTerms
const coursesModel = DB.courses

const createTerm = [
    body('courseId').notEmpty().withMessage('Please select course!').custom((value) => {
        return coursesModel.findByPk(value).then(res => {
            if(!res){
                return Promise.reject('Course does not exists')
            }
            return true
        })
    }),
    body('TermTitle').notEmpty().withMessage('Please enter title!'),
    body('overview').notEmpty().withMessage('Please enter overview!'),
    body('duration').notEmpty().withMessage('Please enter duration!')
]

const updateTerm = [
    param('termId').isNumeric().withMessage('Please select the valid term!').custom(value => {
        return courseTermsModel.findByPk(value).then(reel => {
            if(!reel){
                return Promise.reject('Term does not exists!')
            }
            return true
        })
    }),
    body('courseId').notEmpty().withMessage('Please select course!').custom((value) => {
        return coursesModel.findByPk(value).then(res => {
            if(!res){
                return Promise.reject('Course does not exists')
            }
        })
    }),
    body('TermTitle').notEmpty().withMessage('Please enter title!'),
    body('overview').notEmpty().withMessage('Please enter overview!'),
    body('duration').notEmpty().withMessage('Please enter duration!')
]

const fetchTerm = [
    param('termId').isNumeric().withMessage('Please select the valid term!').custom(value => {
        return courseTermsModel.findByPk(value).then(reel => {
            if(!reel){
                return Promise.reject('Term does not exists!')
            }
            return true
        })
    }),
]

const deleteTerm = [
    param('termId').isNumeric().withMessage('Please select the valid term!').custom(value => {
        return courseTermsModel.findByPk(value).then(reel => {
            if(!reel){
                return Promise.reject('Term does not exists!')
            }
            return true
        })
    }),
]

module.exports = {
    createTerm,
    updateTerm,
    deleteTerm,
    fetchTerm
}