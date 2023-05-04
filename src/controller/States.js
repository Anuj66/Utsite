const DB = require("../models")
const stateModel = DB.states
const countryModel = DB.country

module.exports.getAll = async(req, res) => {
    try {
        const countryId = req.params.countryId
        let filters = {}
        if(countryId && countryId !== '' && countryId !== 0){
            filters.countryID = countryId
        }

        const states = await stateModel.findAll({
            attributes: ['id', 'stateName'],
            where: filters
        });
        return res.status(200).json(states);
    } catch (error) {
        return res.status(400).json({error:error});
    }
}