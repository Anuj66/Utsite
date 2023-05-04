const DB = require("../models")
const { Sequelize, Op } = require('sequelize')
const ejs = require("ejs");
const { sendMailWithTemplate } = require("./SendMail");

const emailModel = DB.emails
const courseModel = DB.courses
const sapModel = DB.studentApplications
const sapFeedbackModel = DB.sapFeedback
const feedbackParamsModel = DB.showReelFeedbackParameters

const sendSelectionMail = async (sapId) => {
    
    try{
        let sapData = await sapModel.findByPk(sapId, {
            include:[
                {
                    model: courseModel,
                    attributes:['title']
                },
                {
                    model: sapFeedbackModel,
                    include:{
                        model: feedbackParamsModel,
                        attributes:['parameterTitle']
                    }
                }
            ]
        })
        
        
        if(sapData){
            let content, emailTemplate = '';
            if(sapData.status === 'Approved'){
                emailTemplate = await emailModel.findOne({
                    where:{
                        slug: 'sap-approved'
                    }
                })
                
                content = ejs.render(emailTemplate.template.replace(/(\r\n|\n\r|\r|\n)/g, '<br>'), {
                    "username": sapData.name,
                    "courseName": sapData.course.title,
                    "appNo": sapData.code,
                    "courseFees": "4,00,000/- + 18% GST",
                    "feePlan": "Full Payment / Quarterly / EMI",
                    "eduLoanLink": "Education loan link goes here",
                    "discount": "20%",
                    "discontedFees": "3,20,000/- + 18% GST",
                    "paymentLink": "paymentLink goes here",
                    "mobileNo": "8879922522",
                    "bookingFees": "40,000",
                    "admissionFees": "2,80,000",
                    "totalFees": "3,20,000"
                })
                
            }else{
                emailTemplate = await emailModel.findOne({
                    where:{
                        slug: 'sap-rejected'
                    }
                })
                let rejectReason = ''
                if(sapData.sapFeedbacks.length > 0){
                    const paramsRows = sapData.sapFeedbacks.map(feedback => (
                        `<tr>
                        <td>${feedback.showReelFeedbackParameter.parameterTitle}</td>
                        <td>${feedback.feedback}</td>
                        </tr> `
                        )).join('');
                        
                        
                        rejectReason = `<br><table style="width:100%;" cellspacing="0" border="1px">
                        <thead>
                        <tr>
                                    <th>Feedback For</th>
                                    <th>Feedback</th>
                                    </tr>
                                    </thead>
                                    <tbody>${paramsRows}</tbody>
                                    </table>`
                                }else{
                                    rejectReason = sapData.feedbackComment
                                }
                                
                                content = ejs.render(emailTemplate.template.replace(/(\r\n|\n\r|\r|\n)/g, '<br>'), {
                                    "username": sapData.name, 
                                    "courseName": sapData.course.title,
                                    "rejectReason": rejectReason
                                })
                            }
                            // console.log(sapData);
                            // console.log(emailTemplate);
                            if(sendMailWithTemplate(`${process.env.EMAILFROMNAME} <${process.env.EMAILFROMEMAIL}>`, sapData.email, emailTemplate.subject, content)){
                                sapData.selectionMailSent = 'Yes'
                                await sapData.save()
                            }
                        }
                    } catch(e){
                        console.log(e);
                    }
                }
                
                module.exports = {
    sendSelectionMail
}