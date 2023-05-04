'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('emails', [
      {
        id: 1,
        slug: "sap-interview-scheduled",
        subject: "Utside - Interview Scheduled",
        template:`Dear <%= username %> \n
        This email is in response to your application for UtSide's 1-Year specialisation in <%= courseTitle %>. We are glad to inform you that your showreel/ resume has been shortlisted by our mentors for a personalised interview. The interview would be of maximum 30 minutes, post that we will inform you about your selection.\n
        Your interview would be conducted at <%= interviewScheuledOn %>.
        Click the below link to join the meeting: 
        <a href="<%= interviewLink %>" ><%= interviewLink %></a>\n
        We wish you all the best for the same.\n
        Regards,
        Team UtSide`,
        placeHolders: "username, courseTitle, interviewScheuledOn, interviewLink",
        createdBy: 1
      },
      {
        id: 2,
        slug: "sap-approved",
        subject: "Utside - Application Approved",
        template: `Dear <%= username %>, \n
                Greetings from UtSide India's 1st Online AVGC Campus.
                We are happy to inform, that you have been selected for Utside's 1-year specialisation in <%= courseName %>.
                We request you to take note of the following information related to your specialisation Program.
                <table border="1" style="border-collapse:collapse;width:100%"><thead><tr><td><strong>Sr. No.</strong></td><td><strong>Particulars</strong></td><td><strong>Details</strong></td></tr></thead><tbody><tr><td>1</td><td>Name of the course</td><td><%= courseName %></td></tr><tr><td>2</td><td>Application Number</td><td><%= appNo %></td></tr><tr><td>3</td><td>Total Course Fees</td><td><%= courseFees %></td></tr><tr><td>4</td><td>Fee Plan</td><td><%= feePlan %></td></tr></tbody></table><strong>Note:</strong> If you want to avail our Loan facility, please mail us on <a href="mailto:enquiry@utside.com" >enquiry@utside.com</a>\n
                As per our <strong>Inaugural offer</strong>, we are offering a <strong>discount of 20%*</strong> on the Total Course Fee\n
                <strong>So, you need to pay Total fees is Rs <%= discontedFees %></strong>
                <table border="1" style="border-collapse:collapse;width:100%"><thead><tr><td><strong>Particulars</strong></td><td style="text-align: right;"><strong>Amount (Rs) *</strong></td></tr></thead><tbody><tr><td>Booking Fees</td><td style="text-align: right;"><%= bookingFees %></td></tr><tr><td>Admission & Tuition Fees</td><td style="text-align: right;"><%= admissionFees %></td></tr><tr><td>Total Fees</td><td style="text-align: right;"><%= totalFees %></td></tr></tbody></table>
                <ul style="list-style-type: decimal; padding:0; list-style-position: inside;"><li>*GST as per prevailing rate is applicable & will be collected additionally from the candidate. Current GST rate is 18%</li><li>At the time of Enrolment, a Booking Fee is Rs 40,000 + GST is to be paid within 7 days of the application been selected.</li><li>Admission Fees of is Rs 2,80,000 + GST is to be paid on or before 31st Aug 2022.</li></ul>
                Payment through <strong>Net Banking</strong> please find below the bank details.
                Account Name: Utside Private Limited
                Bank Name: ICICI Bank
                A/C no: 026305007064
                IFSC Code: ICIC0000263
                Branch: Lokhandwala Branch \n
                <strong>Important Instructions</strong>
                <ul><li>Kindly note that the last date for payment of fees is <strong>31st Aug, 2022</strong></li><li>Once you complete with payment of fees you need send the screen shot on <a href="mailTo:accounts@utside.com">accounts@utside.com</a>  or WhatsApp on <a href="https://wa.me/91<%= mobileNo %>"><%= mobileNo %></a> along with the application number</li><li>You will receive your receipt of the fees payment on you registered Email Id within 24hrs of making the payment</li></ul>\n
                Regards
                Team UtSide`,
        placeHolders: "username, courseName, appNo, courseFees, feePlan, eduLoanLink, discount, discontedFees, paymentLink, mobileNo",
        createdBy: 1
      },
      {
        id: 3,
        slug: "sap-rejected",
        subject: "Utside - Application Rejected",
        template: `Dear <%= username %>,\n
                  We regret to inform you that you have not been selected for the <%= courseName %> course. We wish you all the best for your future ahead, we appreciate your interest and time for the course you applied and thank you for giving us opportunity to learn about your skills and accomplishments. \n
                  Reason for rejection: <%- rejectReason %> \n
                  Regards
                  Team UtSide`,
        placeHolders: "username, courseName, rejectReason",
        createdBy: 1
      },
      {
        id: 4,
        slug: "sap-interview-re-scheduled",
        subject: "Utside - Interview Re-Scheduled",
        template:`Dear <%= username %>, \n
        This email is in response to your application for UtSide's 1-Year specialisation in <%= courseTitle %>. We regret to be inform you that due to <%= rescheduleReason %>, the interview has been rescheduled to <%= interviewScheuledOn %>.
        We are sorry for the inconvenience, please be available for the interview.
        Wish you all the best for the same. \n
        Regards,
        Team UtSide`,
        placeHolders: "username, courseTitle, rescheduleReason, interviewScheuledOn",
        createdBy: 1
      },
      {
        id: 5,
        slug: "forgot-password",
        subject: "Utside - Forgot Password",
        template:'Hello <%= username %>, \n\n'+
                  'Somebody requested a new password for the UtSide account associated with <%= useremail %>.\n\n'+
                  'No changes have been made to your account yet.\n\n'+
                  'You can reset your password by clicking the link below:\n\n'+
                  '<a href="<%= forgotpasswordlink %>"><%= forgotpasswordlink %></a>\n\n'+
                  'If you did not request a new password, please let us know immediately by replying to this email.\n\n'+
                  'Yours,\n'+
                  'Team UtSide',
        placeHolders: "username, forgot-password-link",
        createdBy: 1
      }
    ], {
      updateOnDuplicate:["subject", "template", "placeHolders"]
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('emails', null, {});
  }
};
