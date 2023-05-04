const ResponseFormatter = require("../utils/ResponseFormatter")
const moment = require('moment')
const DB = require('../models')
const {sendMailWithTemplate} = require('../utils/SendMail')

const interviewModel = DB.sapInterview
const sapModel = DB.studentApplications
const emailModel = DB.emails
const courseModel = DB.courses
const mentorModel = DB.users

const ejs = require("ejs");

const addInterview = async(req, res, next) => {
    const { sapId, interviewDate, interviewTime, interviewLink} = req.body

    /* check sap is exists */
    const { count: sapCount, rows: applications } = await sapModel.findAndCountAll({
        where:{
            id:sapId
        }
    })

    if(sapCount === 0){
        return res.status(404).json(ResponseFormatter.setResponse(false, 404, 'Student not found!', 'Error', ''))
    }

    // check if interview already added 
    const {count} = await interviewModel.findAndCountAll({
        where: {
            sapId: sapId
        }
    })

    if(count > 0){
        return res.status(422).json(ResponseFormatter.setResponse(false, 422, 'Interview already added!', 'Error', []))
    }

    try{
        let interviewObj = new interviewModel({
            sapId: sapId,
            interviewDate: moment(interviewDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            interviewTime: moment(`${interviewTime}`).format('HH:mm'),
            interviewLink: interviewLink
        })
    
        await interviewObj.save()

        let sap = await sapModel.findByPk(sapId,{
            include:[
                {
                    model: courseModel,
                    attributes:['title']
                },
                {
                    model: mentorModel,
                    attributes:['fname', 'lname', 'email']
                }
            ]
        })
        sap.status = 'Interview Scheduled'
        await sap.save();
        
        const emailTemplate = await emailModel.findOne({
            where:{
                slug: 'sap-interview-scheduled'
            }
        })

        const mentorEmailTemplate = await emailModel.findOne({
            where:{
                slug: 'sap-interview-scheduled-mentor'
            }
        })

        const content = ejs.render(emailTemplate.template.replace(/(\r\n|\n\r|\r|\n)/g, '<br>'), {
            "username": sap.name, 
            "interviewScheuledOn": moment(`${interviewObj.interviewDate} ${interviewObj.interviewTime}`).format('DD/MM/YYYY hh:mm a'), 
            "courseTitle": sap.course.title,
            "interviewLink": interviewObj.interviewLink
        })

        const mentorContent = ejs.render(mentorEmailTemplate.template.replace(/(\r\n|\n\r|\r|\n)/g, '<br>'), {
            "username": `${sap.user.fname} ${sap.user.lname}`, 
            "interviewScheuledOn": moment(`${interviewObj.interviewDate} ${interviewObj.interviewTime}`).format('DD/MM/YYYY hh:mm a'), 
            "courseTitle": sap.course.title,
            "interviewLink": interviewObj.interviewLink,
            "studentName": sap.name
        })

        const enquiryContent = ejs.render(mentorEmailTemplate.template.replace(/(\r\n|\n\r|\r|\n)/g, '<br>'), {
            "username": 'Administrator', 
            "interviewScheuledOn": moment(`${interviewObj.interviewDate} ${interviewObj.interviewTime}`).format('DD/MM/YYYY hh:mm a'), 
            "courseTitle": sap.course.title,
            "interviewLink": interviewObj.interviewLink,
            "studentName": sap.name
        })

        sendMailWithTemplate(`${process.env.EMAILFROMNAME} <${process.env.EMAILFROMEMAIL}>`, sap.email, emailTemplate.subject, content) //send mail to student
        sendMailWithTemplate(`${process.env.EMAILFROMNAME} <${process.env.EMAILFROMEMAIL}>`, sap.user.email, emailTemplate.subject, mentorContent) //send mail to mentor
        sendMailWithTemplate(`${process.env.EMAILFROMNAME} <${process.env.EMAILFROMEMAIL}>`, process.env.APPLICATION_TEAM_EMAIL, emailTemplate.subject, enquiryContent) // send mail to utside enquiry
        
        return res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Inerview scheduled succesfiully.', 'Success', interviewObj))
    }catch(e){
        
        return res.status(422).json(ResponseFormatter.setResponse(false, 422, 'Something went wrong!', 'Error', e.message))
    }
}

const getDetails = async(req, res, next) => {
    const { sapId} = req.params
    try{
        const {count, rows} = await interviewModel.findAndCountAll({
            where: {
                sapId: sapId
            }
        })
    
        if(count  === 0){
            return res.status(422).json(ResponseFormatter.setResponse(false, 422, 'No interview schedule found for student!', 'Error', []))
        }

        return res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Interview Details', 'Success', rows[0]))
        
    }catch(e){
        return res.status(422).json(ResponseFormatter.setResponse(false, 422, 'Something went wrong!', 'Error', e.message))
    }

}

const reScheduleInterview = async(req, res, next) => {
    const {sapId} = req.params
    const { interviewDate, interviewTime, interviewLink, rescheduleReason} = req.body

    // check if interview already added 
    const {count, rows} = await interviewModel.findAndCountAll({
        where: {
            sapId: sapId
        },
    })

    
    if(count  === 0){
        return res.status(422).json(ResponseFormatter.setResponse(false, 422, 'No interview schedule found for student!', 'Error', []))
    }

    try{
        
        let interviewObj = await interviewModel.findByPk(rows[0].id)

        interviewObj.interviewDate = moment(interviewDate, 'DD/MM/YYYY').format('YYYY-MM-DD')
        interviewObj.interviewTime = moment(`${interviewTime}`).format('HH:mm')
        interviewObj.interviewLink = interviewLink,
        interviewObj.rescheduleReason = rescheduleReason
            
    
        await interviewObj.save()

        let sap = await sapModel.findByPk(sapId,{
            include:[
                {
                    model: courseModel,
                    attributes:['title']
                },
                {
                    model: mentorModel,
                    attributes:['fname', 'lname', 'email']
                }
            ]
        })
        sap.status = 'Interview Scheduled'
        await sap.save();
        console.log(sap.user);
        const emailTemplate = await emailModel.findOne({
            where:{
                slug: 'sap-interview-re-scheduled'
            }
        })

        const mentorEmailTemplate = await emailModel.findOne({
            where:{
                slug: 'sap-interview-re-scheduled-mentor'
            }
        })

        const content = ejs.render(emailTemplate.template.replace(/(\r\n|\n\r|\r|\n)/g, '<br>'), {
            "username": sap.name, 
            "interviewScheuledOn": moment(`${interviewObj.interviewDate} ${interviewObj.interviewTime}`).format('DD/MM/YYYY hh:mm a'), 
            "courseTitle": sap.course.title,
            "interviewLink": interviewObj.interviewLink,
            "rescheduleReason": interviewObj.rescheduleReason
        })

        const mentorContent = ejs.render(mentorEmailTemplate.template.replace(/(\r\n|\n\r|\r|\n)/g, '<br>'), {
            "username": `${sap.user.fname} ${sap.user.lname}`, 
            "interviewScheuledOn": moment(`${interviewObj.interviewDate} ${interviewObj.interviewTime}`).format('DD/MM/YYYY hh:mm a'), 
            "courseTitle": sap.course.title,
            "interviewLink": interviewObj.interviewLink,
            "rescheduleReason": interviewObj.rescheduleReason,
            "studentName": sap.name
        })

        const enquiryContent = ejs.render(mentorEmailTemplate.template.replace(/(\r\n|\n\r|\r|\n)/g, '<br>'), {
            "username":'Administrator', 
            "interviewScheuledOn": moment(`${interviewObj.interviewDate} ${interviewObj.interviewTime}`).format('DD/MM/YYYY hh:mm a'), 
            "courseTitle": sap.course.title,
            "interviewLink": interviewObj.interviewLink,
            "rescheduleReason": interviewObj.rescheduleReason,
            "studentName": sap.name
        })

        sendMailWithTemplate(`${process.env.EMAILFROMNAME} <${process.env.EMAILFROMEMAIL}>`, sap.email, emailTemplate.subject, content, [], [sap.user.email, process.env.ENQUIRY_EMAIL])
        sendMailWithTemplate(`${process.env.EMAILFROMNAME} <${process.env.EMAILFROMEMAIL}>`, sap.user.email, emailTemplate.subject, mentorContent) //send mail to mentor
        sendMailWithTemplate(`${process.env.EMAILFROMNAME} <${process.env.EMAILFROMEMAIL}>`, process.env.APPLICATION_TEAM_EMAIL, emailTemplate.subject, enquiryContent) // send m
        
        return res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Inerview re-scheduled succesfiully.', 'Success', interviewObj))
    }catch(e){
        
        return res.status(422).json(ResponseFormatter.setResponse(false, 422, 'Something went wrong!', 'Error', e.message))
    }
}

module.exports = {
    addInterview,
    getDetails,
    reScheduleInterview
}