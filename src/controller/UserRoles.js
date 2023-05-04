const ResponseFormatter = require("../utils/ResponseFormatter")
const { Op } = require("sequelize")
const DB = require("../models")

const userRolesModel = DB.userRoles


const getAll = async(req, res) => {
    try{
        const {status = ['Active']} = req.body
        
        const {count, rows: userRoles} = await userRolesModel.findAndCountAll({
            attributes:["id", "role","status"],
            where:{
                status: {
                    [Op.in] : status
                }
            }
        })

        if(count > 0){
            return res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Roles found.', 'Success', {totalRecs:count, roles: userRoles}))
        }else{
            return res.status(404).json(ResponseFormatter.setResponse(false, 200, 'No Records found!', 'Success', ''))
        }
    }catch(error){
        return res.status(404).json(ResponseFormatter.setResponse(false, 200, 'No Records found!', 'Success', error.message))
    }
}

module.exports = {
    getAll
}
