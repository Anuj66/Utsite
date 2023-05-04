const ResponseFormatter = require("../utils/ResponseFormatter")
const DB = require("../models")
// const { sendMail } = require('../utils/SendMail')
const WebinarModel = DB.webinar

const create = async (req, res, next) => {
    
    const {name, email, mobile, city, course, weinardatetime} = req.body

    /* check already contest already submitted by email */
    const { count:emailCount } = await WebinarModel.findAndCountAll({
        where:{
            email:email
        }
    })
    
    if(emailCount > 0){
        return res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Email already exists!', 'Error', ''))
    }

    /* check already contest already submitted by mobile number */
    const { count:mobileCount } = await WebinarModel.findAndCountAll({
        where:{
            mobileNo:mobile 
        }
    })
    
    if(mobileCount > 0){
        return res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Mobile number already exists!', 'Error', ''))
    }
    
    try{
        /* get total no of records */
        const lastRecord = await WebinarModel.findOne({
            attributes:['webinarNo'],
            order:[['id', 'DESC']],
            limit:1
        })
        const lastToken = (!lastRecord) ? 'WEBINAR' : lastRecord.webinarNo
        const tokenPrefix = 'WEBINAR'
        const newTokenNumber = (String(lastToken).replace(tokenPrefix, '')*1+1)
        const newToken = tokenPrefix+(String(newTokenNumber).padStart(4, 0))
        
        /* insert record in database */
        let webinarUser = new Webinars({
            webinarNo:newToken,
            fullname: name,
            email: email,
            mobileNo: mobile,
            city:city,
            areaOfIntrerest: course,
            webinarSlots: weinardatetime
        })
        
        webinarUser = await webinarUser.save()
        // const mailTemplate = '<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0"><table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8" ><tr><td><table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"align="center" cellpadding="0" cellspacing="0"><tr><td style="height:80px;">&nbsp;</td></tr><tr><td><table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"style="max-width:670px;background:#fff; border-radius:3px; -webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);"><tr><td style="height:40px;">&nbsp;</td></tr><tr><td style="padding:0 35px;"><h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:sans-serif;text-align:center;">Utside Webianr</h1><span style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:0px solid #cecece; width:100px;"></span><p style="color:#455056; font-size:15px;line-height:24px; margin:0;">Hi,</p><span style="display:inline-block; vertical-align:middle; margin:10px 0 10px; border-bottom:0px solid #cecece; width:100px;"></span><p style="color:#455056; font-size:15px;line-height:24px; margin:0;">Thank you for registering with UtSide webinar</p><p style="color:#455056; font-size:15px;line-height:24px; margin:0;">You have selected the slot for webinar is : '+ weinardatetime +'</p><span style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:0px solid #cecece; width:100px;"></span><span style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:0px solid #cecece; width:100px;"></span><p style="color:#455056; font-size:15px;line-height:24px; margin:0;">Regards</p><p style="color:#455056; font-size:15px;line-height:24px; margin:0;">Team UtSide</p><img src="https://utside.com/api/images/footer-banner.jpg" style="max-width: 100%;" /></td></tr><tr><td style="height:40px;">&nbsp;</td></tr></table></td></tr><tr><td style="height:20px;">&nbsp;</td></tr><tr><td style="height:80px;">&nbsp;</td></tr></table></td></tr></table></body>';
        // await sendMail('UtSide Webianr <utside.activity@gmail.com>', email, 'UtSide Webinar', mailTemplate)
        
        return res.status(200).json(ResponseFormatter.setResponse(true, 200, 'webinar registration done successfully.', 'Success', webinarUser))
    }catch(e){
        return res.status(422).json(ResponseFormatter.setResponse(false, 422, 'Something went wrong!', 'Error', e.message))
    }
}

const getAll = async(req, res, next) => {
    try{
        const Webinars = await WebinarModel.findAll()
        return res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Webinar entries found.', 'Success', Webinars))
    }catch(e){
        return res.status(422).json(ResponseFormatter.setResponse(false, 422, 'Something went wrong!', 'Error', e.message))
    }
}

module.exports ={
    create,
    getAll
}