const ResponseFormatter = require("../utils/ResponseFormatter")
const bcrypt = require("bcrypt")
const DB = require("../models")
const { sendMail } = require('../utils/SendMail')
const StringHelpers = require("../utils/StringHelpers")

const contestUsersModel = DB.contestUsers

const create = async (req, res, next) => {
    
    const {name, email, mobile, contest} = req.body

    /* check already contest already submitted by email */
    const { count:emailCount } = await contestUsersModel.findAndCountAll({
        where:{
            email:email
        }
    })
    
    if(emailCount > 0){
        return res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Email already exists!', 'Error', ''))
    }

    /* check already contest already submitted by mobile number */
    const { count:mobileCount } = await contestUsersModel.findAndCountAll({
        where:{
            mobileNo:mobile 
        }
    })
    
    if(mobileCount > 0){
        return res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Mobile number already exists!', 'Error', ''))
    }
    
    try{
        /* get total no of records */
        const lastRecord = await contestUsersModel.findOne({
            attributes:['token'],
            order:[['id', 'DESC']],
            limit:1
        })
        const lastToken = (!lastRecord) ? 'CONTEST0' : lastRecord.token
        const tokenPrefix = 'CONTEST'
        const newTokenNumber = (String(lastToken).replace(tokenPrefix, '')*1+1)
        const newToken = tokenPrefix+(String(newTokenNumber).padStart(4, 0))
        const encNewtoken = StringHelpers.encrypt(newToken)
        /* insert record in database */
        let contestUser = new contestUsersModel({
            name: name,
            email: email,
            mobileNo: mobile,
            contest: contest,
            token: newToken
        })
        
        contestUser = await contestUser.save()
        const mailTemplate = '<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0"><table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8" ><tr><td><table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"align="center" cellpadding="0" cellspacing="0"><tr><td style="height:80px;">&nbsp;</td></tr><tr><td><table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"style="max-width:670px;background:#fff; border-radius:3px; -webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);"><tr><td style="height:40px;">&nbsp;</td></tr><tr><td style="padding:0 35px;"><h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:sans-serif;text-align:center;">Utside SkillSquad Contest</h1><span style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:0px solid #cecece; width:100px;"></span><p style="color:#455056; font-size:15px;line-height:24px; margin:0;">Hi,</p><span style="display:inline-block; vertical-align:middle; margin:10px 0 10px; border-bottom:0px solid #cecece; width:100px;"></span><p style="color:#455056; font-size:15px;line-height:24px; margin:0;">Thank you for registering with UtSide SkillSquad Contest, click on the button to submit your entry</p><p style="text-align: center;"><a href="'+process.env.CONTEST_APP_URL+'/contest-submit/'+encNewtoken+'" style="background:#aa629c;text-decoration:none !important; font-weight:500; margin-top:10px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Submit Entry</a></p><p style="color:#455056; font-size:15px;line-height:24px; margin:0;">Last date for submission of entry - 12th June 2022</p><p style="color:#455056; font-size:15px;line-height:24px; margin:0;">Note: (Kindly submit your work before due date).</p><span style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:0px solid #cecece; width:100px;"></span><span style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:0px solid #cecece; width:100px;"></span><p style="color:#455056; font-size:15px;line-height:24px; margin:0;">Regards</p><p style="color:#455056; font-size:15px;line-height:24px; margin:0;">Team UtSide</p><img src="https://utside.com/api/images/footer-banner.jpg" style="max-width: 100%;" /></td></tr><tr><td style="height:40px;">&nbsp;</td></tr></table></td><tr><td style="height:20px;">&nbsp;</td></tr><tr><td style="height:80px;">&nbsp;</td></tr></table></td></tr></table></body>';
        await sendMail('UtSide Contest <utside.activity@gmail.com>', email, 'UtSide SkillSquad Contest', mailTemplate)
        
        return res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Contest registered successfully.', 'Success', contestUser))
    }catch(e){
        return res.status(422).json(ResponseFormatter.setResponse(false, 422, 'Something went wrong!', 'Error', e.message))
    }
}

const getByToken = async(req, res, next) => {
    const enctoken = req.params.token
    const token = StringHelpers.decrypt(enctoken)

    try{
        /* find user by User Identity Number */
        const contestUser = await contestUsersModel.findOne({
            where: {
                token: token
            }
        })

        if(!contestUser){
            return res.status(400).json(ResponseFormatter.setResponse(false, 400, "Invalid user identity number!", 'Error', ''))
        }

        return res.status(200).json(ResponseFormatter.setResponse(true, 200, "User Found.", 'Success', contestUser))
    }catch(e){
        return res.status(400).json(ResponseFormatter.setResponse(false, 400, "Invalid user identity number!", 'Error', e.message))
    }

}

const getAll = async(req, res, next) => {
    try{
        const contests = await contestUsersModel.findAll()
        return res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Contest entries found.', 'Success', contests))
    }catch(e){
        return res.status(422).json(ResponseFormatter.setResponse(false, 422, 'Something went wrong!', 'Error', e.message))
    }
}

const update = async (req, res, next) => {
    const contestId = req.params.contestId
    const {resourceLink} = req.body
    try{
        /* check contest registered with token */
        let contestUser = await contestUsersModel.findByPk(contestId)
        
        if(!contestUser){
            return res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Invalid contest user!', 'Error', ''))
        }

        /* update record in database */
        contestUser.resourceLink = resourceLink

        contestUser = await contestUser.save()
        return res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Contest Submitted successfully.', 'Success', contestUser))
    }catch(e){
        return res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', e.message))
    }
}

module.exports ={
    create,
    getByToken,
    getAll,
    update
}