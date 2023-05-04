const ResponseFormatter = require("../utils/ResponseFormatter")
const moment = require("moment")
const DB = require("../models")
const { sendSelectionMail } = require("../utils/SapMails")


const feedbackParamsModel = DB.showReelFeedbackParameters
const sapFeedbackModel = DB.sapFeedback
const sapModel = DB.studentApplications


const getParamsList = async( req, res, next) => {
    const {courseId: sapId} = req.params

    try{
        /* check sap is exists */
        const { count: sapCount, rows: applications } = await sapModel.findAndCountAll({
            where:{
                id: sapId
            }
        })

        if(sapCount > 0){
            
            const {count, rows} = await feedbackParamsModel.findAndCountAll({
                attributes: ["id", "parameterTitle"],
                where:{
                    courseId: applications[0].courseId
                }
            })
    
            if(count === 0){
                res.status(200).json(ResponseFormatter.setResponse(true, 200, 'No parameters found for course!', 'Success', []))
                return
            }
    
            return res.status(200).json(ResponseFormatter.setResponse(true, 200, '', 'Success', rows))
        }else{
            return res.status(422).json(ResponseFormatter.setResponse(false, 422, 'Student not found!', 'Error', []))    
        }

    }catch(e){
        
        return res.status(422).json(ResponseFormatter.setResponse(false, 422, 'Something went wrong!', 'Error', e.message))
    }
}

const addFeedback = async (req, res, next) => {
    
    const {sapId, feedbackParams, feedbackParamsGrade, comments, status} = req.body
    
    /* check sap is exists */
    const { count: sapCount, rows: applications } = await sapModel.findAndCountAll({
        where:{
            id:sapId
        }
    })

    if(sapCount === 0){
        return res.status(404).json(ResponseFormatter.setResponse(false, 404, 'Student not found!', 'Error', ''))
    }

    /* check feedback already added or not */
    const { count: feedbackCount, rows: apps } = await sapFeedbackModel.findAndCountAll({
        where:{
            sapId:sapId
        }
    })
    
    if(feedbackCount > 0){
        return res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Feedback already exists!', 'Error', ''))
    }

    try{
        
        const feedbacksAdded = await Promise.all(Object.keys(feedbackParams).map(async (index) => {
            const paramId = String(index).replace('param_', '')
            const feedBackObj = new sapFeedbackModel({
                'sapId': sapId,
                'feedbackParameterId': paramId,
                'feedback': feedbackParams[index],
                'grade': feedbackParamsGrade[index],
                'createdBy': req.user.id
            })  
            
            await feedBackObj.save()
            return feedBackObj
        }))
       
        let sap = await sapModel.findByPk(sapId)
        sap.status = status
        sap.feedbackComment = comments
        await sap.save();

        // Send mail of content
        
        return res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Feedback submitted successfully.', 'Success', feedbacksAdded))
    }catch(e){
        return res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', e.message))
    }
}

const getSapFeedback = async( req, res, next) => {
    const {sapId} = req.params
    
    try{

        /* check sap is exists */
        const { count: sapCount, rows: applications } = await sapModel.findAndCountAll({
            where:{
                id:sapId
            }
        })

        if(sapCount === 0){
            return res.status(404).json(ResponseFormatter.setResponse(false, 404, 'Student not found!', 'Error', ''))
        }

        
        const {count, rows} = await sapFeedbackModel.findAndCountAll({
            attributes: ["id", "feedbackParameterId", "feedback", "grade"],
            where:{
                sapId: sapId
            },
            include:[
                {
                    model:feedbackParamsModel,
                    attributes:['parameterTitle']
                }
            ]
        })

        if(count === 0){

            return res.status(200).json(ResponseFormatter.setResponse(true, 200, 'No feedback added for application!', 'Success', []))
        }

        return res.status(200).json(ResponseFormatter.setResponse(true, 200, '', 'Success', rows))

    }catch(e){
        return res.status(422).json(ResponseFormatter.setResponse(false, 422, 'Something went wrong!', 'Error', e.message))
    }
}

const updateFeedback = async (req, res, next) => {
    const {sapId} = req.params
    const {feedbackParams, feedbackParamsGrade, status, comments} = req.body

    /* check sap is exists */
    const { count: sapCount, rows: applications } = await sapModel.findAndCountAll({
        where:{
            id:sapId
        }
    })

    if(sapCount === 0){
        return res.status(404).json(ResponseFormatter.setResponse(false, 404, 'Student not found!', 'Error', ''))
    }


    /* check feedback already added or not */
    const { count:feedbackCount } = await sapFeedbackModel.findAndCountAll({
        where:{
            sapId:sapId
        }
    })
    
    if(feedbackCount === 0){
        return res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Feedback does not exists!', 'Error', ''))
    }

    try{

        const feedbacksUpdated = await Promise.all(Object.keys(feedbackParams).map(async (index) => {
            const paramId = String(index).replace('param_', '')
            let feedBackObj = await sapFeedbackModel.findOne({
                where: {
                    sapId: sapId,
                    feedbackParameterId:paramId
                }
            })

            feedBackObj.feedback =  feedbackParams[index]
            feedBackObj.grade =  feedbackParamsGrade[index]
            feedBackObj.updatedBy =  req.user.id
            await feedBackObj.save()
            return feedBackObj
        }))
        
        let sap = await sapModel.findByPk(sapId)
        sap.status = status
        sap.feedbackComment = comments
        await sap.save();
        
        return res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Feedback submitted successfully.', 'Success', feedbacksUpdated))
    }catch(e){
        return res.status(422).json(ResponseFormatter.setResponse(false, 422, 'Something went wrong!', 'Error', e.message))
    }
}

const addFinalFeedback = async (req, res, next) => {
    const {sapId} = req.params
    const {status, comments} = req.body

    /* check sap is exists */
    const { count: sapCount } = await sapModel.findAndCountAll({
        where:{
            id : sapId
        }
    })

    if(sapCount === 0){
        return res.status(404).json(ResponseFormatter.setResponse(false, 404, 'Student not found!', 'Error', ''))
    }

    try{

        /* update intervie status */
        let interview = await sapFeedbackModel.findOne({
            where:{
                sapId: sapId
            }
        })

        if(interview){
            interview.status = (["Approved", "Rejected"].includes(status)) ? 'Attended' : 'Not Appeared For Interview'
            interview.save();
        }


        /* update sap status **/
        let sap = await sapModel.findByPk(sapId)
        sap.status = status
        sap.feedbackDate = moment().format('YYYY-MM-DD hh:mm')
        sap.feedbackComment = comments
        await sap.save()
       
        await sendSelectionMail(sapId)
        
        return res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Feedback submitted successfully.', 'Success', []))

    }catch(e){
        return res.status(422).json(ResponseFormatter.setResponse(false, 422, 'Something went wrong!', 'Error', e.message))
    }
}

module.exports = {
    getParamsList,
    getSapFeedback,
    addFeedback,
    updateFeedback,
    addFinalFeedback
}