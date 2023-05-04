const express = require('express')
const crm = require("../controller/Crm")
const {validate} = require("../middleware/Validation")
const Auth = require("../middleware/Auth")
const HasRole = require('../middleware/HasRole')

/*** Import Validations rules using in Validation middleware ***/
const {crmRules} = require("../validations/Crm")

/*--------------------------*/

/*** Import Module Routes ***/
const publicRoutes = require("./Public")
const sapRoutes = require("./Sap")
const usersRoutes = require("./Users")
const contestUsersRoutes = require("./ContestUsers")
const webinarRoutes = require("./Webinar")
const SapFeedbackRoutes = require("./SapFeedback")
const SapInterviewRoutes = require("./SapInterviewRoutes")
const CoursesRoutes = require("./Courses")
const BatchesRoutes = require("./Batches")
const DemoReelsRoutes = require("./DemoReels")
const TermsRoutes = require("./Terms")
const ContentRoutes = require("./Content")
const WeekRoutes = require('./Weeks')
const CommunicationRoutes = require('./Communicatons')
const ClassRoutes = require('./Class')


/** ------------ **
Defining Routes
** ------------ **/
const router = new express.Router()

/*** Global/Public APIs Routes ***/
router.post('/crm/getLead', validate(crmRules) , crm.addLead);


/*** Module Specific Routes ***/
router.use('/', publicRoutes);
router.use('/sap', sapRoutes);
router.use('/users', usersRoutes);
router.use('/contest', contestUsersRoutes);
router.use('/webinar', webinarRoutes);
router.use('/mentor/sap-feedback', Auth, SapFeedbackRoutes);
router.use('/mentor/sap/interview', Auth, SapInterviewRoutes);
router.use('/courses', Auth, CoursesRoutes);
router.use('/courses/batches', Auth, BatchesRoutes);
router.use('/demoreels', Auth, HasRole.isMentor, DemoReelsRoutes);
router.use('/courses/terms', Auth, TermsRoutes);
router.use('/content', Auth, ContentRoutes)
router.use('/terms',Auth, TermsRoutes)
router.use('/weeks', Auth, WeekRoutes)
router.use('/class', Auth, ClassRoutes)
router.use('/communication', Auth, CommunicationRoutes)

/*** Export Routrer for import in main application file ***/
module.exports = router;
