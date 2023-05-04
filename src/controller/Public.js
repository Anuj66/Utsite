const ResponseFormatter = require("../utils/ResponseFormatter")
const { Op } = require("sequelize")
const DB = require("../models")

const countryModel = DB.Country

const getCountryList = async(req, res) => {
    try{
        const countries = await countryModel.findAll({
            attributes:["id", "country_name", "phone_code"],
            where: {
                status: "Active"
            }
        })
        return res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Countries list', 'Success', countries))
    }catch(error){
        return res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message))
    }
}

module.exports = {
    getCountryList
}