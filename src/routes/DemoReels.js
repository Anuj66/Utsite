const express = require('express')
const DemoReels = require('../controller/DemoReels')
const {validate} = require("../middleware/Validation")
const { createReel, updateReel, fetchReel, deleteReel } = require("../validations/DemoReels")

const router = new express.Router()

router.post('/', validate(createReel), DemoReels.create)
router.get("/:reelId", validate(fetchReel), DemoReels.getByID)
router.put('/:reelId', validate(updateReel), DemoReels.update)
router.delete("/:reelId", validate(deleteReel), DemoReels.remove)
router.post('/get-list', DemoReels.getAll)

module.exports = router;