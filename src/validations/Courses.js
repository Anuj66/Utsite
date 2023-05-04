const { body, param, check } = require("express-validator");
const moment = require("moment");
const { Op } = require("sequelize");
const DB = require('../models')

const coursesModel = DB.courses

const createCourse = [
    body('title').notEmpty().withMessage('Please enter title!').custom((value) => {
        return coursesModel.findOne({
            where:{
                title: value
            },
            paranoid:false
        }).then(course => {
            if(course){
                return Promise.reject('Course title already exists!')
            }
            return true
        })
    }),
    body('duration').notEmpty().withMessage('Please enter duration!'),
    body('overview').notEmpty().withMessage('Please enter overview!'),
    body('status').notEmpty().withMessage('Please select status!'),
    body('fees').notEmpty().withMessage('Please enter fees!'),
    body('lastDateToApply').notEmpty().withMessage('Please select date for last date to apply!').custom(value => {
        const dt = moment(value)
        if(!dt.isValid()){
            throw new Error('Please select date for last date to apply!')
        }else if(dt.isSameOrBefore(moment())){
            throw new Error('Last date to apply should not be past date!')
        }
        return true;
    }),
    body('thumbnail').custom((value, {req}) => {
        if(!req.files.thumbnail){
            throw new Error('Please upload thumbnail!')
        }
        return true
    }).custom((value, {req}) => {
        const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
        let {mimetype} = req.files.thumbnail[0]
        if(!SUPPORTED_FORMATS.includes(mimetype)){
            throw new Error('Only images format(jpg, jped, png, gif) allowed!')
        }        
        return true
    }),
    body('promotionalVideo').custom((value, {req}) => {
        if(!req.files.promotionalVideo){
            throw new Error('Please upload promotional video!')
        }
        return true
    }).custom((value, {req}) => {
        const SUPPORTED_FORMATS = ['video/mp4', 'video/x-ms-wmv', 'video/webm'];
        let {mimetype} = req.files.promotionalVideo[0]
        if(!SUPPORTED_FORMATS.includes(mimetype)){
            throw new Error('Only video format allowed!')
        }        
        return true
    }),
    body('description').notEmpty().withMessage('Please enter course details!')
]

const updateCourse = [
    param('courseId').isNumeric().withMessage('Please select the valid course!').custom(value => {
        return coursesModel.findByPk(value).then(course => {
            if(!course){
                return Promise.reject('Course does not exists!')
            }
            return true
        })
    }),
    body('title').notEmpty().withMessage('Please enter title!').custom((value, {req}) => {
        return coursesModel.findOne({
            where:{
                title:{
                    [Op.eq]: value
                },
                id:{
                    [Op.ne]: req.params.courseId
                }
            },
            paranoid:false
        }).then(course => {
            if(course){
                return Promise.reject('Course title already exists!')
            }
            return true
        })
    }),
     body('duration').notEmpty().withMessage('Please enter duration!'),
    body('overview').notEmpty().withMessage('Please enter overview!'),
    body('status').notEmpty().withMessage('Please select status!'),
    body('fees').notEmpty().withMessage('Please enter fees!'),
    body('lastDateToApply').notEmpty().withMessage('Please select date for last date to apply!').custom(value => {
        if(moment(value).isSameOrBefore(moment())){
            throw new Error('Last date to apply should not be past date!')
        }
        return true;
    }),
    body('thumbnail').custom((value, {req}) => {
        if(req.files.thumbnail){
            const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
            let {mimetype} = req.files.thumbnail[0]
            if(!SUPPORTED_FORMATS.includes(mimetype)){
                throw new Error('Only images format(jpg, jped, png, gif) allowed!')
            }        
        }
        return true
    }),
    body('promotionalVideo').custom((value, {req}) => {
        if(req.files.promotionalVideo){
            const SUPPORTED_FORMATS = ['video/mp4', 'video/x-ms-wmv', 'video/webm'];
            let {mimetype} = req.files.promotionalVideo[0]
            if(!SUPPORTED_FORMATS.includes(mimetype)){
                throw new Error('Only video format allowed!')
            }        
        }
        return true
    }),
    body('description').notEmpty().withMessage('Please enter course details!'),
]

const fetchCourse = [
    param('courseId').isNumeric().withMessage('Please select the valid course!').custom(value => {
        
        return coursesModel.findByPk(value).then(course => {
            if(!course){
                return Promise.reject('Course does not exists!')
            }
            return true
        })
    }),
]

const deleteCourse = [
    param('courseId').isNumeric().withMessage('Please select the valid course!').custom(value => {
        
        return coursesModel.findByPk(value).then(course => {
            if(!course){
                return Promise.reject('Course does not exists!')
            }
            return true
        })
    })
]

module.exports = {
    createCourse,
    updateCourse,
    deleteCourse,
    fetchCourse
}