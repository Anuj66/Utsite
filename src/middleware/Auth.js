const jwt = require('jsonwebtoken');
const ResponseFormatter = require("../utils/ResponseFormatter");
const DB = require('../models');

const UsersModel = DB.users
const assignedrolesModel = DB.assignedRoles

module.exports = async (req, res, next) => {
  try {
    
    const SECRET = process.env.JWT_SECRET;
    const usertoken = req.headers.authorization;

    if(!usertoken){
      return res.status(401).json(ResponseFormatter.setResponse(false, 401, 'Unauthorized!', 'Error', ''));
    }
    
    const token = usertoken.split(' ');
    const JWT_TOKEN = token[1];
    const decoded = await jwt.verify(JWT_TOKEN, SECRET);
    
    const userId = decoded.userId;
    const user = await UsersModel.findByPk(userId,{
      include:[{
        model: assignedrolesModel,
        attributes: ["roleId"]
      }]
    });
    
    if (!user) {
      return res.status(401).json(ResponseFormatter.setResponse(false, 401, 'User not found!', 'Error', ''));
    } else {
      req.user = user
      next();
    }

  } catch(error) {  
    // console.log(error);  
    return res.status(401).json(ResponseFormatter.setResponse(false, 401, error.message, 'Error', error.message));
  }
};