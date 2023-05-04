'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('emails', [
      {
        id: 8,
        slug: "sap-interview-scheduled-mentor",
        subject: "Utside - Interview Scheduled",
        template:`Dear <%= username %> \n
        This email is in response to your application for UtSide's 1-Year specialisation in <%= courseTitle %>. The personalised interview for <%= studentName %>  would be counducted at <%= interviewScheuledOn %>.
        Click the below link to join the meeting: 
        <a href="<%= interviewLink %>" ><%= interviewLink %></a>\n
        Regards,
        Team UtSide`,
        placeHolders: "username, courseTitle, interviewScheuledOn, interviewLink",
        createdBy: 1
      },
      {
        id: 9,
        slug: "sap-interview-re-scheduled-mentor",
        subject: "Utside - Interview Re-Scheduled",
        template:`Dear <%= username %>, \n
        This email is in response to your application for UtSide's 1-Year specialisation in <%= courseTitle %>. We regret to be inform you that interview of <%= studentName %> due to <%= rescheduleReason %>, the interview has been rescheduled to <%= interviewScheuledOn %>.
        We are sorry for the inconvenience, please be available for the interview.
        Regards,
        Team UtSide`,
        placeHolders: "username, courseTitle, rescheduleReason, interviewScheuledOn",
        createdBy: 1
      },
      {
        id: 10,
        slug: "new-sap-recived",
        subject: "Utside - New Student Application Received",
        template:`Greetings, \n
        This is to inform you that the applicant <%= studentName %> has submitted the application for <%= courseName %> on <%= appDate %> at <%= appTime %>. All details submitted by student is as given below.
        <%- studentDetail %>
        Regards,
        Team UtSide`,
        placeHolders: "studentName, courseName, appDate, appTime, studentDetail",
        createdBy: 1
      },
    ],{
      updateOnDuplicate:["subject", "template", "placeHolders"]
    });
  },

  async down (queryInterface, Sequelize) {
    
  }
};
