const express = require("express");
const Batches = require("../controller/Batches");
const { validate } = require("../middleware/Validation");
const {
  createBatch,
  updateBatch,
  fetchBatch,
  deleteBatch,
  getStudents,
  getBatches,
  getBatchStudents,
  getBatchMentorDetails,
  getBatchClasses
} = require("../validations/Batches");

const router = new express.Router();

router.post("/", validate(createBatch), Batches.create);
router.get("/:batchId", validate(fetchBatch), Batches.getByID);
router.put("/:batchId", validate(updateBatch), Batches.update);
router.delete("/:batchId", validate(deleteBatch), Batches.remove);
router.post("/get-list", Batches.getAll);
router.post("/get-students", Batches.getStudents);

/** Author Purva**/
router.post("/get-batches", Batches.getBatches);
router.post("/getMentorBatches", validate(getBatchMentorDetails), Batches.getMentorBatchDetails);
router.post("/getBatchStudents", validate(getBatchStudents), Batches.getBatchStudents);
router.post("/getBatchNo", Batches.getBatchNumbers);
router.post("/getBatchesIntake", Batches.getBatchesIntake);

router.post("/getBatchClasses", validate(getBatchClasses) ,Batches.getBatchClasses)

module.exports = router;
