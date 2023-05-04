const express = require('express')
const sap = require("../controller/Sap")
const multer = require("../middleware/UploadFile")
const Auth = require("../middleware/Auth")
const {validate} = require("../middleware/Validation")


const {assignMentorRules} = require("../validations/Sap")

const router = new express.Router()


router.get("/remove-dummy", sap.removeDuplicates);

router.post('/sendOTP/',  sap.sendOTP);
router.post('/verifyOTP/',  sap.verifyOTP);
router.post('/register/', multer.uploadPDF.single('resume'), sap.add, multer.validateFileUpload);
router.get('/:sapId/', sap.getDetails);
router.post('/send-enrollment-mail', Auth, validate(assignMentorRules), sap.sendSelectionStatusMail);
router.post('/get-sap/', sap.getByMobileNo);
router.post('/getList', Auth, sap.getAll);
router.post('/assign-to-mentor', Auth, validate(assignMentorRules), sap.assignToMentor);
router.post('/statics', Auth, sap.getStatics);
router.post('/reject', Auth, validate(assignMentorRules), sap.rejectApps);



module.exports = router;