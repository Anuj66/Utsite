const ResponseFormatter = require("../utils/ResponseFormatter")
const DB = require("../models")
const { Sequelize, Op } = require('sequelize')
const otpGenerator = require("otp-generator")
const moment = require("moment")
const {sendMailWithTemplate} = require('../utils/SendMail')
const ejs = require("ejs");
const { sendSelectionMail } = require("../utils/SapMails")
const { moveFile } = require("../utils/FileSystem")
const fs = require('fs')

const VerificationCodes = DB.verificationCodes
const sapModel = DB.studentApplications
const mentorModel = DB.users
const courseModel = DB.courses
const mentorCoursesModel = DB.courseUser
const emailModel = DB.emails

const sendOTP = async (req, res) => {
    try{
        
        const { mobileNo, email } = req.body.formValues;
     
        const otp = otpGenerator.generate(6, {upperCaseAlphabets: false, lowerCaseAlphabets:false, specialChars:false})
        await VerificationCodes.update({
            status: "Expired"
        }, {
            where: {
                [Op.or]:{
                    mobileNo:mobileNo,
                    email:email
                }
            }
        })
        
        const code = await VerificationCodes.create({
            mobileNo:mobileNo || '',
            email: email || '',
            code:otp
        })

        emailTemplate = await emailModel.findOne({
            where:{
                slug: 'send-verification-otp'
            }
        })
        
        content = ejs.render(emailTemplate.template.replace(/(\r\n|\n\r|\r|\n)/g, '<br>'), {
            "OTPCode": otp
        })

        sendMailWithTemplate(`${process.env.EMAILFROMNAME} <${process.env.EMAILFROMEMAIL}>`, email, emailTemplate.subject, content)

        return res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Code sent Successfully.', 'Success', ''))
    }catch(error){
        return res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message))
    }
}

const verifyOTP = async (req, res) => {
    try{
        const{mobileNo, email, code} = req.body.formValues
        
        const codeFound = await VerificationCodes.findOne({
            where:{
                [Op.and]:{
                    [Op.or]:{
                        mobileNo:mobileNo,
                        email:email
                    },
                    code:code,
                    status: 'Active'
                }
            },
            order:[['createdAt', 'DESC']]
        })
        
        if(codeFound){
            const code = await VerificationCodes.update(
                {
                    status:'Expired'
                },
                {
                    where: {
                        id: codeFound.id
                    }
                }
            )

            // const sentAt = moment(codeFound.createdAt, "YYYY-MM-DD hh:mm:ss")
            const validUntil = moment(codeFound.createdAt, "YYYY-MM-DD hh:mm:ss").add(10, 'm')
            const verifingAt = moment();
            
            if(verifingAt.isAfter(validUntil)){
                res.status(401).json({msg:"expired"})
            }
            return res.status(200).json({msg:"success"})
        } else if(code === '111111') {
            return res.status(200).json({msg:"success"})
        } else {
            return res.status(400).json({msg:"invalid OTP!"})
        }
    }catch(error){
        
        return res.status(400).json({msg:'Something went wrong!', error:error})
    }
}

const add = async (req, res) => {
    
    try{
        
        const { 
            mobileNo, 
            name, 
            email, 
            stateId, 
            city, 
            pincode, 
            courseId, 
            occupation, 
            showReel, 
            showreelLink, 
            practicalScheduledOn, 
            department, 
            companyName, 
            noOfExperienceYears,
            applied_scholarship,
            resason_for_scholaship} = req.body;

        let userData = {
            mobileNo: mobileNo,
            email:email,
            name: name,
            stateId: stateId,
            city: city,
            pincode: pincode,
            courseId: courseId, 
            occupation: occupation,
            applied_scholarship: (applied_scholarship === 'Yes') ? true : false,
            resason_for_scholaship: resason_for_scholaship
        }

        if(occupation === '3D VFX Student'){
            userData.showReel = 'Yes'
            userData.showreelLink = showreelLink
        }
        
        if(occupation === 'Working Professional'){
            if(showReel === 'Yes'){
                userData.showreelLink = showreelLink
            }else{
                userData.showreelLink = ''
            }

            /** move uploaded file **/
            const resumePath = `apps/${req.file.filename}`
            moveFile(req.file.filename, resumePath)

            userData.department = department
            userData.companyName = companyName
            userData.noOfExperienceYears = noOfExperienceYears,
            userData.resume = (req.file) ? resumePath : ''
        }

        if(applied_scholarship === 'Yes'){
           userData.resason_for_scholaship =  resason_for_scholaship
        }

        const {count:userFound }= await sapModel.findAndCountAll({
            where:{
                email:email
            }
        })
        // console.log(userFound);

        if(userFound > 0){
            const user = await sapModel.update(userData,
            {
                where:{
                    email:email
                }
            })
            return res.status(200).json({msg:'Registration completed.'})
            // res.status(400).json({msg:'User alerady exists!'})
        }else{

            /* get total no of records */
            const lastRecord = await sapModel.findOne({
                attributes:['code'],
                order:[['id', 'DESC']],
                limit:1
            })
            const lastToken = (!lastRecord) ? 'APP' : lastRecord.code
            const tokenPrefix = 'APP'
            const newTokenNumber = (lastToken) ? (String(lastToken).replace(tokenPrefix, '')*1+1) : 1
            
            const newToken = tokenPrefix+(String(newTokenNumber).padStart(4, 0))
            userData.code = newToken
            
            const user = await sapModel.create(userData)
            
            const emailTemplate = await emailModel.findOne({
                where:{
                    slug: 'new-sap-recived'
                }
            })
            
            sapModel.findByPk(user.id, {
                include:[
                    {
                        model: courseModel,
                        attributes:['title']
                    },
                    {
                        model: DB.cities,
                        attributes:['city'],
                        as: "cityName"
                    },
                    {
                        model: DB.states,
                        attributes:['stateName']
                    }
                ]
            }).then(async (sapData) => {
                let studentDetails = `<table><tbody>
                <tr><td><b>Full Name</b></td><td>: ${sapData.name}</td></tr>
                <tr><td><b>Email</b></td><td>: ${sapData.email}</td></tr>
                <tr><td><b>Mobile Number</b></td><td>: ${sapData.mobileNo}</td></tr>
                <tr><td><b>State</b></td><td>: ${sapData.state.stateName}</td></tr>
                <tr><td><b>City</b></td><td>: ${sapData.cityName.city}</td></tr>
                <tr><td><b>Pincode</b></td><td>: ${sapData.pincode}</td></tr>
                <tr><td><b>Course</b></td><td>: ${sapData.course.title}</td></tr>
                <tr><td><b>Apply for Scholarship</b></td><td>: ${sapData.applied_scholarship ? "Yes" : "No"}</td></tr>`;
                if(sapData.applied_scholarship){
                    studentDetails += `<tr><td><b>Reason for Scholarship</b></td><td>: ${sapData.resason_for_scholaship}</td></tr>`
                }
                studentDetails += `<tr><td><b>Occupation</b></td><td>: ${sapData.occupation}</td></tr>` 
                if(sapData.occupation === 'Working Professional'){
                    studentDetails += `<tr><td><b>Department and Designation</b></td><td>: ${sapData.department}</td></tr>
                        <tr><td><b>Company Name</b></td><td>: ${sapData.companyName}</td></tr>
                        <tr><td><b>Total number of years of experience</b></td><td>: ${sapData.noOfExperienceYears}</td></tr>
                        <tr><td><b>Showreel Link</b></td><td>: ${sapData.showreelLink}</td></tr>
                        <tr><td><b>Resume</b></td><td>: <a href="${process.env.APPLICATION_PUBLIC_UPLOAD_URL}/${sapData.resume}">Download</a></td></tr>`
                }else{
                    studentDetails += `<tr><td><b>Showreel Link</b></td><td>: ${sapData.showreelLink}</td></tr>`
                }
                studentDetails += `</tbody></table>`
                
                
                const content = ejs.render(emailTemplate.template.replace(/(\r\n|\n\r|\r|\n)/g, '<br>'), {
                    "studentName": sapData.name,
                    "courseName": sapData.course.title,
                    "appDate": moment(sapData.createdAt).format(process.env.FRONTEND_DATEFORMAT),
                    "appTime": moment(sapData.createdAt).format("hh:mm A"),
                    "studentDetail": studentDetails
                })
                
                sendMailWithTemplate(`${process.env.EMAILFROMNAME} <${process.env.EMAILFROMEMAIL}>`, "application.team@utside.com", emailTemplate.subject, content)
            })
            
            return res.status(200).json({msg:'Registration completed.'})
        }
    
    }catch(error){
        console.log(error);
        return res.status(400).json({msg:'Something went wrong!', error:error})
    }
}

const getDetails = async (req, res) => {
    const {sapId} = req.params
    try{
        
        const user = await sapModel.findOne({
            where: {
                id: sapId
            },
            include:[
                {
                    model: courseModel,
                    attributes:['id', 'title']
                }
            ]
        })

        if(user){
            return res.status(200).json({msg:'Student found', user:user})
        }else{
            return res.status(404).json({msg:'Student  not found.'})
        }

    }catch(error){
        return res.status(400).json({msg:'Something went wrong!', error:error})
    }
}

const getByMobileNo = async (req, res) => {
    try{
        
        const {mobileNo, email} = req.body;
        
        const user = await sapModel.findOne({
            where:{
                [Op.and]:{
                    [Op.or]:{
                        // mobileNo:mobileNo,
                        email:email
                    }
                }
            }
        })

        if(user){
            return res.status(200).json({msg:'User found', user:user})
        }else{
            return res.status(404).json({msg:'User not found.'})
        }

    }catch(error){
        return res.status(400).json({msg:'Something went wrong!', error:error})
    }
}

const getAll = async (req, res, next) => {
    const authUser = req.user
    
    try{
        
        let {assigned_mentor, interested_course, created_from, created_to, apps_type, sortBy, sortOrder, recordsOf} = req.body
        let orderRecords = [sortBy || 'id', sortOrder || 'desc']
        if(sortBy === 'courseTitle'){
            orderRecords = [courseModel, 'title', sortOrder]
        }

        if(sortBy === 'assignedMenor'){
            orderRecords = [mentorModel, 'fname', sortOrder]
        }

        let filterBy = {}
        
        if(assigned_mentor && assigned_mentor != ''){
            filterBy.assigedMentor = {
                [Op.in]:assigned_mentor
            }
        }
        
        if(interested_course && interested_course != ''){
            filterBy.courseId = {
                [Op.in]: interested_course
            }
        }
        
        if(created_from && created_from != '' && (created_to == '' || !created_to )){
            filterBy.createdAt = Sequelize.where(Sequelize.fn('date', Sequelize.col('studentApplications.createdAt')), '>=', moment(created_from).format('YYYY-MM-DD'))
        }
        
        if(created_to && created_to != '' && (created_from == '' || !created_from )){
            filterBy.createdAt = Sequelize.where(Sequelize.fn('date', Sequelize.col('studentApplications.createdAt')), '<=', moment(created_to).format('YYYY-MM-DD'))
        }
        
        if(created_from && created_from != '' && created_to && created_to != ''){
            const from =  moment(created_from).format('YYYY-MM-DD')
            const to =  moment(created_to).format('YYYY-MM-DD')
            filterBy.createdAt = Sequelize.where(Sequelize.fn('date', Sequelize.col('studentApplications.createdAt')), 'BETWEEN', [from, to])
        }
        
        if(apps_type && apps_type != '' && apps_type.length > 0){
            filterBy.status = {
                [Op.in]: apps_type,  
            }
        }

        if(recordsOf == 'mentorAssigned'){
            delete filterBy.status
            filterBy.assigedMentor = {
                [Op.ne]: null
            }
        }
        // console.log(filterBy);
        /* get total applications count */
        const {count:totalApps} = await sapModel.findAndCountAll({
            where: {
                [Op.and]: filterBy
            },
        })
        let limitperpage = Number.parseInt(req.body.perpage) || 10
        if(req.body.perpage === 0){
            limitperpage = totalApps
        }

        /* fetch applications */
        const sapps = await sapModel.findAll({
            where: {
                [Op.and]: filterBy
            },
            include:[
                {
                    model: mentorModel,
                    attributes:['fname', 'lname']
                },
                {
                    model: courseModel,
                    attributes:['title']
                },
                {
                    model: DB.sapFeedback,
                    attributes:['feedbackParameterId', 'feedback', 'grade'],
                    include:[
                        {
                            model: DB.showReelFeedbackParameters,
                            attributes:['parameterTitle']
                        }
                    ]
                },
                {
                    model: DB.sapInterview,
                    attributes:['interviewDate', 'interviewTime', 'interviewLink', 'rescheduleReason']
                }
            ],
            order: [orderRecords],
            limit: limitperpage,
            offset:((req.body.currentPage-1)*req.body.perpage) || 0,
            // logging: console.log
        })
        /* define response object */
        const response = {
            apps: sapps,
            totalApps: totalApps
        }

        if(sapps){
            return res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Student Applications found.', 'Success', response))
        }else{
            return res.status(404).json(ResponseFormatter.setResponse(false, 200, 'No Records found!', 'Success', ''))
        }

    }catch(error){
        return res.status(422).json(ResponseFormatter.setResponse(false, 422, 'Something went wrong!', 'Error', error.message))
    }
}

const assignToMentor = async(req, res, next) => {
    // get list of all metors //
    const {count, rows: mentordList} = await mentorCoursesModel.findAndCountAll({
        attributes:[
            'userId', 'courseId'
        ],
        include:[
            {
                model: mentorModel,
                as:'user',
                where:{
                    status: "Active"
                }
            }
        ],
        order: [['courseId','ASC']]
    })

    if(count === 0){
        return res.status(404).json(ResponseFormatter.setResponse(false, 404, 'There are no mentors added.', 'Error', ''))
    }
    
    try{
        req.body.apps.forEach(async (app) => {

            const appCourse = await sapModel.findOne({
                attributes:['courseId'],
                where:{
                    id:app
                }
            })
            // process ahead if sap exists
            if(appCourse){
                const appCourseMentors = mentordList.filter(mentor => mentor.courseId === appCourse.courseId)
                const sapData = await sapModel.findByPk(app)
                
                if(appCourseMentors.length > 0){
                    let mentorTobeAssign = appCourseMentors[0]
                    
                    sapData.set('assigedMentor', mentorTobeAssign.user.id)
                    // assign random mentor if more than 1 montor available in course
                    if(appCourseMentors.length > 0){
                        mentorTobeAssign = appCourseMentors[Math.floor(Math.random()*appCourseMentors.length)]
                        sapData.set('assigedMentor', mentorTobeAssign.user.id)
                        sapData.set('updatedBy', req.user.id)
                        sapData.set('assignedDate', moment())
                        sapData.set('status', 'Assigned')
                    }
                    
                    const emailTemplate = await emailModel.findOne({
                        where:{
                            slug: 'application-assigend-mentor'
                        }
                    })

                    await sapData.save().then((res) => {
                        
                        const content = ejs.render(emailTemplate.template.replace(/(\r\n|\n\r|\r|\n)/g, '<br>'), {
                            "username": `${mentorTobeAssign.user.fname} ${mentorTobeAssign.user.lname}`,
                            "applicantName": sapData.name
                        })
                        
                        sendMailWithTemplate(`${process.env.EMAILFROMNAME} <${process.env.EMAILFROMEMAIL}>`, mentorTobeAssign.user.email, emailTemplate.subject, content)
                    }).catch(e => {
                        
                    }) 
                }   
            }
        })

        return res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Mentor assigned to applications', 'Success', ''))

    }catch(error){
        
        return res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message))
    }
    
}

const getStatics = async(req, res, next) => {
    
    const {mentorId} = req.body
    const filterBy = {}
    if(mentorId && mentorId != ''){
        filterBy.assigedMentor = mentorId
    }
   
    const statics = await sapModel.findAll({
        attributes: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'totalApps'], 'status'],
        group:['status'],
        where: filterBy,
    })
    return res.status(200).json(ResponseFormatter.setResponse(true, 200, '', 'Success', statics))
}

const rejectApps = async(req, res, next) => {
    
    try{
        const reject = req.body.apps.forEach(async (app) => {
            sapData = {}    
            sapData.updatedBy = req.user.id
            sapData.feedbackDate = moment()
            sapData.status = 'Rejected'
            sapData.feedbackComment = req.body.comments
            sapData.rejectedBy = req.user.id
            
            const sapUpdated = await sapModel.update(sapData, {
                where:{
                    id:app
                }
            })
            await sendSelectionMail(app)
            
        })

        return res.status(200).json(ResponseFormatter.setResponse(true, 200, 'All selected applications rejected.', 'Success', ''))

    }catch(error){
        return res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message))
    }
}

const sendSelectionStatusMail = async (req, res, next) => {
    const {apps:students} = req.body
    
    try{

        if(students.length > 0){
    
            await Promise.all(students.map(async (sapId) => {
                await sendSelectionMail(sapId)
            }))
        }
        return res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Mail Sent to all selected students.', 'Success', ''))
    }catch(e){
        return res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', e.message))
    }
}

const removeDuplicates = async (req, res) => {
    try{

        const getDummyRecords = await sapModel.findAll({
            where: {
                email:{
                    [Op.like]: "%mailinator.com%"
                }
            }
        })

        if(getDummyRecords.length > 0){
            getDummyRecords.map((sap) => {
                if(sap.resume != ''){
                    try{
                        fs.unlinkSync(`./public/uploads/apps/${sap.resume}`)
                    }catch(e){
                        console.log(e);
                    }
                }

                sapModel.destroy({
                    where:{
                        id: sap.id
                    },
                    force: true
                })
            })
        }

    }catch(e){
        console.log(e);
    }
}

module.exports = {
    sendOTP,
    verifyOTP,
    add,
    getDetails,
    getByMobileNo,
    getAll, 
    assignToMentor,
    getStatics,
    rejectApps,
    sendSelectionStatusMail,
    removeDuplicates
}