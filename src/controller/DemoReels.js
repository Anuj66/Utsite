const ResponseFormatter = require("../utils/ResponseFormatter")
const { Op } = require("sequelize")
const DB = require("../models")

const DemoReelsModel = DB.mentorDemoreels

const create = async(req, res) => {
    
    const { reelType, reelUrl } = req.body
    
    try{
        
        const demoreel = new DemoReelsModel({
            userId: req.user.id,
            reelType: reelType, 
            reelUrl: reelUrl
        })
        
        await demoreel.save()
        
        return res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Demoreel added successfully.', '', demoreel));

    }catch(error){
        return res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
}

const getByID = async(req, res) => {
    try{
        
        const demoreel = await DemoReelsModel.findOne({
            where:{
                id: req.params.reelId
            }
        })

        if(demoreel){
            return res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Demoreel found.', 'Success', demoreel))
        }else{
            return res.status(404).json(ResponseFormatter.setResponse(false, 404, 'Demoreel not found!', 'Error', ''))
        }

    }catch(error){
        return res.status(422).json(ResponseFormatter.setResponse(false, 422, 'Something went wrong!', 'Error', error.message))
    }
}

const update = async(req, res, next) => {
   const {reelId} = req.params
    
    try{
        
        const demoreel = await DemoReelsModel.findByPk(reelId)
        const possibleFields = [ 'reelType', 'reelUrl']

        possibleFields.forEach((field, index) => {
            if(req.body[field]){
                demoreel.set(field, req.body[field])
            }
        })

        await demoreel.save()

        return res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Demoreel updated successfully', 'Success', demoreel));

    }catch(error){
        return res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
}

const remove = async(req, res) => {
    
    const {reelId} = req.params
    
    try{
        const demoreel = await DemoReelsModel.findByPk(reelId)
        await demoreel.save()

        await DemoReelsModel.destroy({
            where:{
                id: reelId
            }
        })
        return res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Demoreel deleted successfully.', 'Sucess', ''));

    }catch(error){
        return res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
}

const getAll = async (req, res) => {
    try{
        const {sortBy='id', sortOrder='desc', perpage=10, currentPage=1} = req.body
        let orderRecords = [sortBy || 'id', sortOrder || 'desc']
        
        let filterBy = {}
        
        /*** If trying to get list by mentor then filter by assigned logged in mentor ***/
        filterBy.userId = {
            [Op.eq]: req.user.id
        }
        /**********/
        
        const {count} = await DemoReelsModel.findAndCountAll({
            where: filterBy
        })
        
        
        let limitperpage = Number.parseInt(perpage) || 10
        if(perpage === 0){
            limitperpage = count
        }

        const demoreeles = await DemoReelsModel.findAll({
            attributes:['id', 'userId', 'reelType', 'reelUrl'],
            where: filterBy,
            order: [orderRecords],
            limit: limitperpage,
            offset:((currentPage-1)*perpage) || 0
        })


        if(count > 0){
            const response = {
                demoreeles: demoreeles,
                totalRecs: count
            }
            return res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Demoreeles found.', 'Success', response))
        }else{
            return res.status(404).json(ResponseFormatter.setResponse(false, 200, 'No Records found!', 'Success', ''))
        }

    }catch(error){
        return res.status(422).json(ResponseFormatter.setResponse(false, 422, 'Something went wrong!', 'Error', error.message))
    }
}


module.exports = {
    create,
    getByID,
    update,
    remove,
    getAll
}
