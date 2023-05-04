const { body, param } = require("express-validator");
const { Op } = require("sequelize");
const DB = require('../models')

const DemoReelsModel = DB.mentorDemoreels

const createReel = [
    body('reelType').notEmpty().withMessage('Please select demoreel type!').isIn(['Vimeo', 'Youtube', 'Artstation', 'Other']).withMessage('Please select valid demoreel type!'),
    body('reelUrl').notEmpty().withMessage('Please enter demoreel url!').isURL().withMessage('Please enter valid demoreel link!').custom((value, {req}) => {
        const reelType = req.body.reelType
        const youtubeRegx = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
        const vimeoRegx = /https:\/\/vimeo.com\/\d{8}(?=\b|\/)/
        if(reelType === 'Youtube' && !youtubeRegx.test(value)){
            throw new Error('Please enter valid youtube url!')
            return false;
        }

        if(reelType === 'Vimeo' && !vimeoRegx.test(vimeoRegx)){
            throw new Error('Please enter valid vimeo url!')
            return false;
        }

        return true;
    }).custom(async(value, {req}) => {
        return DemoReelsModel.findOne({
            where:{
                reelType:{
                    [Op.eq]: req.body.reelType,
                },
                reelUrl:{
                    [Op.eq]: value
                },
                userId:{
                    [Op.eq]: req.user.id
                }
            }
        }).then(batch => {
            if(batch){
                return Promise.reject('Demoreel url already exists!')
            }
            return true
        })
    })
]

const updateReel = [
    param('reelId').isNumeric().withMessage('Please select the valid demoreel!').custom(value => {
        return DemoReelsModel.findByPk(value).then(reel => {
            if(!reel){
                return Promise.reject('demoreel does not exists!')
            }
            return true
        })
    }),
    body('reelType').notEmpty().withMessage('Please select demoreel type!'),
    body('reelUrl').notEmpty().withMessage('Please enter demoreel url!').isURL().withMessage('Please enter valid demoreel link!').custom((value, {req}) => {
        const reelType = req.body.reelType
        const youtubeRegx = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
        const vimeoRegx = /https:\/\/vimeo.com\/\d{8}(?=\b|\/)/
        if(reelType === 'Youtube' && !youtubeRegx.test(value)){
            throw new Error('Please enter valid youtube url!')
            return false;
        }

        if(reelType === 'Vimeo' && !vimeoRegx.test(vimeoRegx)){
            throw new Error('Please enter valid vimeo url!')
            return false;
        }

        return true;
    }).custom(async(value, {req}) => {
        return DemoReelsModel.findOne({
            where:{
                reelType:{
                    [Op.eq]: req.body.reelType,
                },
                reelUrl:{
                    [Op.eq]: value
                },
                userId:{
                    [Op.eq]: req.user.id
                },
                id:{
                    [Op.ne]: req.params.reelId
                }
            }
        }).then(batch => {
            if(batch){
                return Promise.reject('Demoreel url already exists!')
            }
            return true
        })
    })
]

const fetchReel = [
    param('reelId').isNumeric().withMessage('Please select the valid demoreel!').custom(value => {
        return DemoReelsModel.findByPk(value).then(reel => {
            if(!reel){
                return Promise.reject('demoreel does not exists!')
            }
            return true
        })
    }),
]

const deleteReel = [
    param('reelId').isNumeric().withMessage('Please select the valid demoreel!').custom(value => {
        return DemoReelsModel.findByPk(value).then(reel => {
            if(!reel){
                return Promise.reject('demoreel does not exists!')
            }
            return true
        })
    }),
]

module.exports = {
    createReel,
    updateReel,
    deleteReel,
    fetchReel
}