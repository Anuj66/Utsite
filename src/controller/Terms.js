const ResponseFormatter = require("../utils/ResponseFormatter")
const { Op } = require("sequelize")
const DB = require("../models")

const courseTermsModel = DB.courseTerms

const create = async(req, res) => {
    
    const { courseId, TermTitle,  overview, duration } = req.body
    
    try{
        
        const term = new courseTermsModel({
            courseId: courseId, 
            TermTitle: TermTitle, 
            overview: overview, 
            duration: duration
        })
        
        await term.save()
        
        return res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Term added successfully.', '', term));

    }catch(error){
        return res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
}

const getByID = async(req, res) => {
    try{
        
        const term = await courseTermsModel.findOne({
            where:{
                id: req.params.termId
            }
        })

        if(term){
            return res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Term found.', 'Success', term))
        }else{
            return res.status(404).json(ResponseFormatter.setResponse(false, 404, 'Term not found!', 'Error', ''))
        }

    }catch(error){
        return res.status(422).json(ResponseFormatter.setResponse(false, 422, 'Something went wrong!', 'Error', error.message))
    }
}

const update = async(req, res, next) => {
   const {termId} = req.params
    
    try{
        
        const term = await courseTermsModel.findByPk(termId)
        const possibleFields = [ 'courseId', 'TermTitle',  'overview', 'duration' ]

        possibleFields.forEach((field, index) => {
            if(req.body[field]){
                term.set(field, req.body[field])
            }
        })

        await term.save()

        return res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Term updated successfully', 'Success', term));

    }catch(error){
        return res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
}

const remove = async(req, res) => {
    
    const {termId} = req.params
    
    try{
        const term = await courseTermsModel.findByPk(termId)
        await term.save()

        await courseTermsModel.destroy({
            where:{
                id: termId
            }
        })
        return res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Term deleted successfully.', 'Sucess', ''));

    }catch(error){
        return res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
}

const getAll = async (req, res) => {
    try{
        const {sortBy='id', sortOrder='desc', perpage=10, currentPage=1, courseId, groupBy = 'id'} = req.body
        let orderRecords = [sortBy || 'id', sortOrder || 'desc']
        
        let filterBy = {}
        
        if(courseId && courseId != ''){
            filterBy.courseId = {
                [Op.eq]: courseId
            }
        }
        
        const {count} = await courseTermsModel.findAndCountAll({
            where: filterBy
        })
        
        
        let limitperpage = Number.parseInt(perpage) || 10
        if(perpage === 0){
            limitperpage = count
        }

        const terms = await courseTermsModel.findAll({
            attributes:['id', 'courseId', 'TermTitle',  'overview', 'duration', 'termNo' ],
            where: filterBy,
            order: [orderRecords],
            limit: limitperpage,
            offset:((currentPage-1)*perpage) || 0,
            group: groupBy
        })


        if(count > 0){
            const response = {
                terms: terms,
                totalRecs: count
            }
            return res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Terms found.', 'Success', response))
        }else{
            return res.status(202).json(ResponseFormatter.setResponse(false, 200, 'No Records found!', 'Success', ''))
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
