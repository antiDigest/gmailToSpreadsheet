function getMonthFromString(month){
  var d = Date.parse(month + " 1, 2012");
  if(!isNaN(d)){
    return new Date(d).getMonth();
  }
  return -1;
 }

function isNumeric(num){
  return !isNaN(num)
}