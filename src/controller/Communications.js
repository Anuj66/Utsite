const ResponseFormatter = require("../utils/ResponseFormatter");
const DB = require("../models");
const { Op } = require("sequelize");

const CommunicationModel = DB.communication;

const create = async (req, res) => {
  const {communication} = req.body;
  
  try {
    
    if(communication.length > 0){
      
      const inserted = await Promise.all(communication.map(async (communicate) => {
        if(parseInt(communicate.roleId) === -1){
          communicate.roleId = null
        }

        const existsCount = await CommunicationModel.count({
          where:{
            reciever: communicate.roleId
          }
        })
        if(existsCount > 0){
          await CommunicationModel.update({
            reciever: communicate.roleId,
            message: communicate.message,
            isPublished: communicate.status,
            updatedBy: req.user.id
          },{
            where:{
              reciever: communicate.roleId
            }
          });
          let communication = await CommunicationModel.findOne({
            where:{
              reciever: communicate.roleId
            }
          })

          communication = communication.toJSON()
          if(communication.reciever === null){
            communication.reciever = -1
          }
          return communication;
        }else{
          return await CommunicationModel.create({
            reciever: communicate.roleId,
            message: communicate.message,
            isPublished: communicate.status,
            createdBy: req.user.id
          });
        }        
        
      }))
      
      return res
        .status(200)
        .json(
          ResponseFormatter.setResponse(
            true,
              200,
            "Communication messages saved successfully.",
            "",
            inserted
          )
        );
    }  
  } catch (error) {
    // console.log(error);
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong!",
          "Error",
          error.message
        )
      );
  }
};

const getAll = async (req, res) => {
  try{
    let communications = await CommunicationModel.findAll({});

    communications = communications.map((communication) => {
      communication = communication.toJSON()
      if(communication.reciever === null){
        communication.reciever = -1
      }
      return communication
    })

    return res
    .status(200)
    .json(
      ResponseFormatter.setResponse(
        true,
          200,
        "Communication messages listed.",
        "",
        communications
      )
    );

  }catch(error){
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong!",
          "Error",
          error.message
        )
      );
  }
}

const fetchByRole = async (req, res, next) => {
  try{
    const roleId = parseInt(req.params.roleId)
    let filterBy = {}
    if(roleId === -1){
      filterBy.reciever = {
        [Op.is]: null
      }
    }else{
      filterBy.reciever = {
        [Op.eq]: roleId
      }
    }

    let communication = await CommunicationModel.findOne({
      where: filterBy
    });

    if(parseInt(roleId) === -1){
      communication = communication.toJSON()
      communication.reciever = -1
    }
    
    if(communication){

      return res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
            200,
          "Communication message found.",
          "",
          communication
        )
      );
    }else{
      return res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
            200,
          "Communication message not found.",
          "",
          communication
        )
      );
    }

  }catch(error){
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong!",
          "Error",
          error.message
        )
      );
  }
}


module.exports = {
  create,
  getAll,
  fetchByRole
};
