const express = require('express')
const Users = require('../controller/Users')
const UserRoles = require('../controller/UserRoles')
const Auth = require("../middleware/Auth")
const UploadFile = require("../middleware/UploadFile")
const {validate} = require("../middleware/Validation")


const {profilePic, createUser, fetchUser, updateUser, updateProfile, deleteUser,loginUser, forgotPassword, refreshToken,BulkStatusUpdate,changePassword} = require("../validations/Users")

const router = new express.Router()

router.post('/', Auth,validate(createUser),  Users.create)
router.get("/:userId", Auth, validate(fetchUser), Users.getByID)
router.put('/:userId', Auth, UploadFile.uploadAny.fields([{ name: 'profile_pic', maxCount: 1 }, { name: 'promo_video', maxCount: 1}]), validate(updateUser), Users.update)
router.delete("/:userId", Auth, validate(deleteUser), Users.remove)
router.post('/get-list', Auth, Users.getAll)
router.post('/login', validate(loginUser), Users.login)
router.post('/forgot-password', validate(forgotPassword), Users.forgotPassword)
router.post('/reset-password/:token', Users.resetPassword)

router.post('/profile-pic', Auth, UploadFile.uploadImage.single('photo'), validate(profilePic), Users.updateProfilePhoto)
router.post('/experience', Auth, Users.addMentorExperience)
router.post('/attach-course', Auth, Users.attachCoourse)
// router.post('/demoreel', Auth, Users.addDemoReel)

router.post('/roles', Auth, UserRoles.getAll)
router.post('/bulk-status-update', Auth, validate(BulkStatusUpdate), Users.bulkUpdateStatus)
router.post('/refresh-token', validate(refreshToken), Users.refreshToken)

router.post('/change-password/:userId',Auth,validate(changePassword),Users.changePassword)
router.put('/update-profile/:userId', Auth, UploadFile.uploadImage.single('photo'), validate(updateProfile) ,Users.updateProfile)

module.exports = router;