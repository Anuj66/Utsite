const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require('path')
const fs = require("fs");
// We add this setting to tell nodemailer the host isn't secure during dev
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


const sendMail = async (from, to, subject, content, attachment = [], cc = []) => {

    // const transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //       user: 'utside.activity@gmail.com',
    //       pass: 'zxukufwtvxpjntlh'
    //     }
    // });

	transporter = nodemailer.createTransport({
		port: 1025,
		service: "Outlook365",
		auth: {
			user: 'enquiry@utside.com',
			pass: 'MuM$4321'
		}
	});

    let mailOptions = {
      from: from,
      to: to,
      subject: subject,
      html: content
    };

	if(cc && cc.length > 0){
		mailOptions.cc = cc.join(', ')
	}
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        return false;
      } else {
        return true
      }
    });
} 


const sendMailWithTemplate = async (from, to, subject, content, attachment = []) => {
	try{

		const template = fs.readFileSync(path.resolve("src", 'emailTemplate/index.ejs')).toString()
		const emilaContent = ejs.render(template, {"emailContent": content, "subject": subject})
		if(process.env.NODE_ENV == 'production'){
			transporter = nodemailer.createTransport({
				port:1025,
				service: "Outlook365",
				auth: {
					user: 'enquiry@utside.com',
					pass: 'MuM$4321'
				}
			});
		}else{
			transporter = nodemailer.createTransport({
				host: 'localhost',
				port: 1025,
				secure: false,
				tls: {
				  // do not fail on invalid certs
				  rejectUnauthorized: false,
				},
			})
		} 
		
		transporter.verify(function (error, success) {
			if (error) {
				console.log(error);
			} else {
				console.log("Server is ready to take our messages");
			}
		});
		
		const  mailOptions = {
			from: from,
			to: to,
			subject: subject,
			html: emilaContent
		}

		transporter.sendMail(mailOptions, function(error, info){
			if (error) {
				return false;
			} else {
				return true
			}
		});
		
	}catch(e){
		console.log(e);
	}
} 
  
module.exports = {
    sendMail,
	sendMailWithTemplate
}