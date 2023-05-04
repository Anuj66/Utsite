const DB = require("../models")
const citiesModel = DB.cities

module.exports.getAll = async(req, res) => {
    const stateId = req.params.stateId
    try {
        const cities = await citiesModel.findAll({
            attributes: ['id', 'city'],
            where:{
                stateId: stateId
            }
        });
        return res.status(200).json(cities);
    } catch (error) {
        return res.status(400).json({error:error});
    }
}