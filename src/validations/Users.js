const { body, param, check }  = require("express-validator");
const {mentorRoleId, studentRoleId} = require("../config/siteConfig")
const bcrypt = require("bcrypt")
const DB = require("../models")
const { Op } = require("sequelize");
const { promise } = require("bcrypt/promises");

const UsersModel = DB.users
const resetPasswordsModel = DB.resetPasswords
const refreshTokenModel = DB.refreshToken

const createUser = [
    body('roleId').isArray().custom(value => {
        if(value.length  === 0){
            throw new Error('Please select user role!')
            return false;
        }

        const studentRole = value.filter((role) => role == studentRoleId)    
        
        if(studentRole.length > 0){
            throw new Error('You can not register student from here!')
            return false;
        }

        const mentorRole = value.filter((role) => role == mentorRoleId)    
        if(mentorRole.length > 0 && value.length > 1){
            throw new Error('You can not select other roles with mentor!')
            return false;
        }
        return true
    }),
    body('fname').notEmpty().withMessage('Please enter first name!').matches(/^[A-Za-z\s]+$/).withMessage('First name must be alphabetic!'),
    body('lname').notEmpty().withMessage('Please enter last name!').matches(/^[A-Za-z\s]+$/).withMessage('Last name must be alphabetic!'),
    body('email').notEmpty().withMessage('Please enter email address!').isEmail().withMessage('Please enter valid email address!').custom((value) => {
        return UsersModel.findAndCountAll({
            where:{ email: value}
        }).then(({count:emailCount}) => {
            if(emailCount > 0){
                return Promise.reject('Email address already exists!')
            }
            return true
        })        
    }),
    body('courseId').custom((value, {req})=>{
        
        if(req.body.roleId.includes(mentorRoleId) && (!value || value === null)){
            throw new Error('Please select course!');
            return false
        }
        return true;
    })
]

const fetchUser = [
    param('userId').notEmpty().withMessage('Please select user to edit!').isNumeric('User not found!').custom(value => {
        return UsersModel.findByPk(value).then((user) => {
            if(!user){
                return Promise.reject('User does not exists!')
            }
            return true
        }) 
    })
]

const updateUser = [
    param('userId').notEmpty().withMessage('Please select user to edit!').isNumeric('User not found!').custom(value => {
        return UsersModel.findByPk(value).then((user) => {
            if(!user){
                return Promise.reject('User does not exists!')
            }
            return true
        }) 
    }),
    body('roleId').isArray().custom(value => {
        if(value.length  === 0){
            throw new Error('Please select user role!')
            return false;
        }

        const studentRole = value.filter((role) => role == studentRoleId)    
        
        if(studentRole.length > 0){
            throw new Error('You can not register student from here!')
            return false;
        }

        const mentorRole = value.filter((role) => role == mentorRoleId)    
        if(mentorRole.length > 0 && value.length > 1){
            throw new Error('You can not select other roles with mentor!')
            return false;
        }
        return true
    }),
    body('fname').notEmpty().withMessage('Please enter first name!').matches(/^[A-Za-z\s]+$/).withMessage('First name must be alphabetic!'),
    body('lname').notEmpty().withMessage('Please enter last name!').matches(/^[A-Za-z\s]+$/).withMessage('Last name must be alphabetic!'),
    body('email').notEmpty().withMessage('Please enter email address!').isEmail().withMessage('Please enter valid email address!').custom((value, {req}) => {
        return UsersModel.findAndCountAll({
            where:{ 
                email: value,
                id:{
                    [Op.ne]: req.params.userId
                }
            }
        }).then(({count:emailCount}) => {
            if(emailCount > 0){
                return Promise.reject('Email address already exists!')
            }
            return true
        })        
    }),
    body('courseId').custom((value, {req})=>{
        
        if(req.body.roleId.includes(mentorRoleId) && (!value || value === null)){
            throw new Error('Please select course!');
            return false
        }
        return true;
    })
];

const deleteUser = [
    param('userId').notEmpty().withMessage('Please select user to edit!').isNumeric('User not found!').custom(value => {
        return UsersModel.findByPk(value).then((user) => {
            if(!user){
                return Promise.reject('User does not exists!')
            }
            return true
        }) 
    }),
]

const loginUser = [
    body('email').notEmpty().withMessage('Please enter email address!').isEmail().withMessage('Please enter valid email address!').custom(value => {
        return UsersModel.findOne({
            where:{
                email: value
            }
        }).then(user => {
            if(!user){
                return Promise.reject('Email address does not exists!')
            }
        })
    }),
    body('password').notEmpty().withMessage('Please enter your password!').isLength({min: 6}).withMessage('Password length must me atleast 6!').custom((value, {req}) => {
        return UsersModel.findOne({
            where:{
                email: req.body.email
            }
        }).then(user => {
            if(user){
                /* match the password **/
                return bcrypt.compare(value, user.password).then(function(passwordMatched) {
                    if(!passwordMatched){
                        return Promise.reject('Invalid password entered!')
                    }
                })
            }
        })
    }),
]

const refreshToken = [
    body('token').notEmpty().withMessage('Please enter refresh token!').custom(async (value) => {
        const refreshToken = await refreshTokenModel.findOne({ where: { token: value } });
        if (!refreshToken || !refreshToken.isActive) {
            throw new Error('Invalid token');
            return false
        }
        return true;
    })
]

const forgotPassword = [
    body('email').notEmpty().withMessage('Please enter email address!').isEmail().withMessage('Please enter valid email address!').custom(value => {
        return UsersModel.findOne({
            where:{
                email: value
            }
        }).then(user => {
            if(!user){
                return Promise.reject('Email address does not exists!')
            }
        })
    }),
]

const resetPassword = [
    param('token').notEmpty().withMessage('Invalid token used!').custom(value => {
        return UsersModel.findOne({
            where:{
                email: value
            }
        }).then(user => {
            if(!user){
                return Promise.reject('Email address does not exists!')
            }
        })
    }),
]

const changePassword = [
    body('currentPassword').notEmpty().withMessage('Please enter your old password!').isLength({min: 6}).withMessage('Password length must me atleast 6!').custom((value, {req}) => {
        return UsersModel.findOne({
            where:{
                id: req.params.userId
            }
        }).then(user => {
            if(user){
                /* match the password **/
                return bcrypt.compare(value, user.password).then(function(passwordMatched) {
                    if(!passwordMatched){
                        return Promise.reject('Please enter correct old password!')
                    }
                })
            }
            return true
        })
    }),
    body('newPassword').notEmpty().withMessage('Please enter new password!')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!.%#&?])[0-9a-zA-Z@$!.%#&?]{6,}$/).withMessage('Please enter a password with atleast 6 character and contain atleast one uppercase, lowercase and special character.')

        .custom((value, { req }) => {
            return UsersModel.findOne({
                where:{
                    id: req.params.userId
                }
            }).then(user => {
                if(user){
                    return bcrypt.compare(value, user.password).then(function(passwordMatched) {
                        if(passwordMatched){
                            return Promise.reject('New password can not be old password!')
                        }
                    })
                }
                return true
            })
    }),
    body('confirmPassword').notEmpty().withMessage('Please enter confirm password').custom((value, {req}) => {
        const password = req.body.newPassword
        if(password !== value){
            throw new Error('Passwords must be same!')
        }
        return true
    }),
]

const profilePic = [
    body('userId').notEmpty().withMessage('Please add user id!'),
    check('photo').custom((value, {req}) => {
    if(!req.file){
        throw new Error('Please upload profile picture!')
    }
    return true
   }),
]

const updateProfile = [
    // param('userId').notEmpty().withMessage('Please select user to edit!').isNumeric('User not found!').custom(value => {
    //     return UsersModel.findByPk(value).then((user) => {
    //         if(!user){
    //             return Promise.reject('User does not exists!')
    //         }
    //         return true
    //     }) 
    // }),
    body('fname').notEmpty().withMessage('Please enter first name!').matches(/^[A-Za-z\s]+$/).withMessage('First name must be alphabetic!'),
    body('lname').notEmpty().withMessage('Please enter last name!').matches(/^[A-Za-z\s]+$/).withMessage('Last name must be alphabetic!'),
    body('country').notEmpty().withMessage('Please select country!'),
    body('state').notEmpty().withMessage('Please select state!'),
    body('city').notEmpty().withMessage('Please select city!'),
    body('zipcode').notEmpty().withMessage('Please enter zip code!').isNumeric().withMessage('Zip code must be numeric.'),
    body('address1').notEmpty().withMessage('Please enter address!')
];
const BulkStatusUpdate = [
    body('status').notEmpty().withMessage('Please enter status'),
    body('userIds').notEmpty().withMessage('Please select users!')
]

module.exports = {
    createUser,
    fetchUser,
    updateUser,
    deleteUser,
    loginUser,
    refreshToken,
    forgotPassword,
    resetPassword,
    changePassword,
    profilePic,
    updateProfile,
    BulkStatusUpdate
}