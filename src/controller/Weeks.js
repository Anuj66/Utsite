const ResponseFormatter = require("../utils/ResponseFormatter");
const { generateWeeksList } = require("../utils/Weeks");

const getWeeks = async (req, res) => {
  try {
    const { termNo, courseId } = req.body;
    
    const weeksList = await generateWeeksList(termNo, courseId)
    
    if(weeksList.length > 0){
        const response = {
            weeks: weeksList,
            totalRecs: weeksList.length
        }
        return res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Weeks listed.', 'Success', response))
    }else{
        return res.status(202).json(ResponseFormatter.setResponse(false, 200, 'No weeks found!', 'Success', ''))
    }

  } catch (error) {
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong",
          "error",
          error.message
        )
      );
  }
};

module.exports ={
  getWeeks
}