

const { noOfTermsPerCourse, durationInMonthsOfEachTerm, totalWeeksInMonth } = require("../config/siteConfig");

/**
 * mananged the terms of courses
 * Each courses has fixed number(4) of courses 
 */
const courseTermsArrToCreate = (courseId) => {
    let termsList = []
    for(let index=1; index <= noOfTermsPerCourse; index++) {
        termsList.push({
            "courseId": courseId,
            "termNo": index,
            "TermTitle": 'Term - '+index,
            "overview": null,
            "duration": durationInMonthsOfEachTerm
        })
        
    } 
    return termsList;
} 

const termNo = (weekNo) => {
    const totalWeeksinEachTerm = durationInMonthsOfEachTerm * totalWeeksInMonth;
    return Math.floor((weekNo/totalWeeksinEachTerm)) + 1
}

module.exports = {
    courseTermsArrToCreate,
    termNo
}