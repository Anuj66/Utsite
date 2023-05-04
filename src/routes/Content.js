const express = require("express");
const Content = require("../controller/Content");
const UploadFile = require("../middleware/UploadFile")
const { validate } = require("../middleware/Validation");
const {
  uploadTempResource,
  deleteTempResource,
  uploadResource,
  getDashboardData,
  getContentDetails,
  getMentorContents,
  saveMentorContents,
  getContentCount,
  saveContentCount,
  saveContents,
  deleteContent,
  getAllContents,
  downloadContent,
  getContentStatistics
} = require("../validations/Content");

const router = new express.Router();

router.get('/statuses', Content.getStatusList)

router.post('/upload-temp-resourse', UploadFile.uploadAny.single('resourse'), validate(uploadTempResource), Content.uploadResource)
router.delete('/delete-temp-resourse', validate(deleteTempResource), Content.deleteTempResources)
router.post('/upload-resourse', validate(uploadResource), Content.uploadContent)
router.delete("/delete-resourse", Content.deleteResources)
router.post("/get-list", Content.getAllContent)
router.post("/get-statistics", validate(getContentStatistics), Content.getStatistics)
/**ADDED BY ANUJ WTS */
router.post("/getContentCount", validate(getContentCount) ,Content.getContentCount);
router.post("/saveContentCount", validate(saveContentCount) ,Content.saveContentCount)
router.post("/dashboardData", validate(getDashboardData), Content.dashboardData);

/**** MAY BE NON USED ROUTES ***/
// router.post('/', validate(saveContents), Content.saveContents)

// router.post("/getMentorContents", validate(getMentorContents), Content.getMentorContents);
// // router.post("/saveMentorContents", validate(saveMentorContents), Content.saveMentorContent);
// router.delete('/deleteContent/:id', validate(deleteContent), Content.deleteContent)
// router.get("/contentDetail", Content.contentDetails);
router.post("/getAllContents", validate(getAllContents), Content.getAllContent)
router.post('/downloadContent', validate(downloadContent) ,Content.downloadContent)

module.exports = router;
