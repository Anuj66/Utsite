const { totalWeeksInMonth, durationInMonthsOfEachTerm, noOfTermsPerCourse } = require("../config/siteConfig");
const DB = require("../models");
const moment = require('moment');


const CourseModel = DB.courses;

const generateWeeksList = async (termNo = 0, courseId = 0) => {
    const weeksPerTerm = durationInMonthsOfEachTerm*totalWeeksInMonth
    
    let weeksList = [];
    let weekStartsFrom = 1
    let weekEndsTo = noOfTermsPerCourse*weeksPerTerm

    
    if(termNo > 0 && termNo <= noOfTermsPerCourse){
      const PrevTermWeekEnd = ((termNo-1)*weeksPerTerm)
      weekStartsFrom = PrevTermWeekEnd+1
      weekEndsTo = termNo*weeksPerTerm
    }
    
    if(courseId > 0){
        const course = await CourseModel.findOne({
            attributes: ["duration"],
            where: {
                id: courseId
            }
        })

        if(weekEndsTo > parseInt(course.duration)){
            weekEndsTo = parseInt(course.duration)
        }
    }
    
    for (let weekNo = weekStartsFrom; weekNo <= weekEndsTo; weekNo++) {
        weeksList.push({
            "weekNo": weekNo,
            "WeekTitle": `Week - ${weekNo}` 
        })
    }
    return weeksList
}

const getNoOfWeeksBetweenDates = (startingDate, endingDate) => {
    const endingDateMoment = moment(endingDate)
    const startingDateMoment = moment(startingDate)
    return endingDateMoment.diff(startingDateMoment, 'weeks')
}

module.exports = {
    generateWeeksList,
    getNoOfWeeksBetweenDates
}