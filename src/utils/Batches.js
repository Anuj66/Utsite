const moment = require('moment');

const isTimeBetween = (
	newStarttime,
	newEndtime,
	existsStarttime,
	existsEndtime
	) => {
	let strReturn = (strReturn1 = strReturn2 = false);
	let date1 = existsStarttime;
	let date2 = newStarttime;
	let date3 = newEndtime;
	console.log(
		date1,
		date2,
		date3,
		date1.getTime() > date2.getTime(),
		date1.getTime() < date3.getTime(),
		date1.getTime() == date2.getTime()
	);
	if (
		(date1.getTime() > date2.getTime() && date1.getTime() < date3.getTime()) ||
		date1.getTime() == date2.getTime()
	) {
		strReturn1 = true;
	}

	date1 = existsEndtime;
	date2 = newStarttime;
	date3 = newEndtime;

	console.log(
		"==>",
		date1,
		date2,
		date3,
		date1.getTime() > date2.getTime(),
		date1.getTime() < date3.getTime(),
		date1.getTime() == date3.getTime()
	);

	if (
		(date1.getTime() > date2.getTime() && date1.getTime() < date3.getTime()) ||
		date1.getTime() == date3.getTime()
	) {
		strReturn2 = true;
	}

	if (strReturn1 && strReturn2) {
		strReturn = true;
	}
	return strReturn;
};

const classDates = (startDate, noOfWeeks, weekDays) => {
	let result = []
	weekDays.sort()
	const startDt = moment(startDate)
	for(let index=0; index<noOfWeeks; index++) {
		let tempDate = moment(startDate).add(index, 'w')
		let tempDay = moment(tempDate).day()
		for(const day of weekDays) {
			const correctDate = moment(tempDate).add(day-tempDay, 'days')
			if(correctDate.isSameOrAfter(startDt)){
				result.push(correctDate)
			}
		}
	}
	return result
}


module.exports = {
	isTimeBetween,
	classDates
}