const { body, param }  = require("express-validator");
const { Op } = require("sequelize");
const DB = require('../models')
const SAPModel = DB.studentApplications
const feedbackParamsModel = DB.showReelFeedbackParameters

const addFeedback = [
    body('sapId').trim().notEmpty().withMessage('Invalid Student!'),
    body('feedbackParams').notEmpty().withMessage('Please add feedbacks for individual parameters').bail().custom(async (value, {req}) => {
        const errorMsg = [];
        const app = await SAPModel.findByPk(req.body.sapId, {attributes: ["courseId"]})
        
        const courseParams = await feedbackParamsModel.findAll({
            where: {
                courseId: app.courseId,
                status: 'Active'
            }
        })
        courseParams.forEach((param) => {
            if(!value[`param_${param.id}`]){
                throw new Error(`Please enter feedback of ${param.parameterTitle}`)
            }else if(value[`param_${param.id}`] === ''){
                throw new Error(`Please enter feedback of ${param.parameterTitle}`)
            }
        })
    }),
    body('feedbackParamsGrade').notEmpty().withMessage('Please add grade for individual parameters').bail().isArray().custom(async (value, {req}) => {
        const errorMsg = [];
        const app = await SAPModel.findByPk(req.body.sapId, {attributes: ["courseId"]})
        
        const courseParams = await feedbackParamsModel.findAll({
            where: {
                courseId: app.courseId,
                status: 'Active'
            }
        })
        courseParams.forEach((param) => {
            if(!value[`param_${param.id}`]){
                throw new Error(`Please enter rating of ${param.parameterTitle}`)
            }else if(value[`param_${param.id}`] === ''){
                throw new Error(`Please enter rating of ${param.parameterTitle}`)
            }
        })
    }),
    body('status').trim().notEmpty().withMessage('Please select status!').isIn(['Rejected', 'Interview Pending', 'Interview Scheduled', 'Not Appeared For Interview','Approved']).withMessage('Please select status!')
]

const updateFeedback = [
    param('sapId').trim().notEmpty().withMessage('Invalid Student!'),
    body('feedbackParams').notEmpty().withMessage('Please add feedbacks for individual parameters').bail().isArray().custom(async (value, {req}) => {
        const app = await SAPModel.findByPk(req.params.sapId, {attributes: ["courseId"]})
        
        const courseParams = await feedbackParamsModel.findAll({
            where: {
                courseId: app.courseId,
                status: 'Active'
            }
        })
        const errorMsg = [];
        courseParams.forEach((param) => {
            paramFeedback = value.filter(valueParam => {
                return valueParam.param == param.id
            })
            
            if(paramFeedback.length  === 0){
                errorMsg[param.id] = `Please enter feedback of ${param.parameterTitle}`
            }else if(paramFeedback[0]['feedback'] === ''){
                errorMsg[param.id] = `Please enter feedback of ${param.parameterTitle}`
            }
        })
        
        if(errorMsg.length > 0){
            return Promise.reject(errorMsg.filter(element => { return element !== null}))
        }
    }),
    body('feedbackParamsGrade').notEmpty().withMessage('Please add grade for individual parameters').bail().isArray().custom(async (value, {req}) => {
        const app = await SAPModel.findByPk(req.params.sapId, {attributes: ["courseId"]})

        const courseParams = await feedbackParamsModel.findAll({
            where: {
                courseId: app.courseId,
                status: 'Active'
            }
        })
        const errorMsg = [];
        courseParams.forEach(param => {
            paramFeedback = value.filter(valueParam => {
                return valueParam.param == param.id
            })
            
            if(paramFeedback.length  === 0){
                errorMsg[param.id] = `Please enter grade of ${param.parameterTitle}`
            }else if(paramFeedback[0]['feedback'] === ''){
                errorMsg[param.id] = `Please enter grade of ${param.parameterTitle}`
            }
        })
        
        if(errorMsg.length > 0){
            return Promise.reject(errorMsg.filter(element => { return element !== null}))
        }
    }),
    body('status').trim().notEmpty().withMessage('Please select status!').isIn(['Rejected', 'Interview Pending', 'Interview Scheduled', 'Not Appeared For Interview','Approved']).withMessage('Please select status!')
]

const finalFeedback = [
    body('status').trim().notEmpty().withMessage('Please select status!').bail().isIn(["Not Appeared For Interview", "Approved", "Rejected"]).withMessage('Please select valid status!'),
    body('comments').trim()
]

module.exports = {
    addFeedback,
    updateFeedback,
    finalFeedback
}