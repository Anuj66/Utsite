function paginate(array, page_size, page_number) {
  // Page Number starts from 1
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}

function removeDuplicates(arr) {
  return arr.filter((item,
      index) => arr.indexOf(item) === index);
}

function weekDay(num) {
  if(num === 0) return 'Mon'
  if(num === 1) return 'Tue'
  if(num === 2) return 'Wed'
  if(num === 3) return 'Thu'
  if(num === 4) return 'Fri'
  if(num === 5) return 'Sat'
  return 'Sun'
}

const dateInIntakeFormat = (intakeDate) => {
  const date = new Date(intakeDate);
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  return month + "-" + year;
};

function groupByFields( array , f )
{
  let groups = {};
  array.forEach( function( o )
  {
    let group = JSON.stringify( f(o) );
    groups[group] = groups[group] || [];
    groups[group].push( o );  
  });
  return Object.keys(groups).map( function( group )
  {
    return groups[group]; 
  })
}

module.exports = {
    paginate,
    removeDuplicates,
    weekDay,
    dateInIntakeFormat,
    groupByFields
}