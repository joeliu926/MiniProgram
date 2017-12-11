var formatTime = function (date, formater) {
  formater =formater||"yyyy-MM-dd hh:mm:ss";
  date = date || new Date().valueOf();
  date = new Date(date);
  var year = date.getFullYear();
  var month = formatNumber(date.getMonth() + 1);
  var day = formatNumber(date.getDate());
  var hour = formatNumber(date.getHours());
  var minute = formatNumber(date.getMinutes());
  var second = formatNumber(date.getSeconds());
  return formater.replace("yyyy", year).replace("MM", month).replace("dd", day).replace("hh", hour).replace("mm", minute).replace("ss", second);
}
let str2Date=function(dateStr){
  if(!dateStr){
    return "";
  }
 // var arr = "2016-11-11 11:11:11".split(/[-:\s+\/]/);
  var arrDate = dateStr.split(/[-:\s+\/]/);
  console.log(arr);
  let resultDate = new Date(arrDate[0], arrDate[1] - 1, arrDate[2], arrDate[3] || "00", arrDate[4] || "00", arrDate[5] || "00");
  return resultDate;
};
var formatNumber = function (n) {
  n = n.toString();
  return n[1] ? n : '0' + n;
}
module.exports = {
  formatTime: formatTime,
  str2Date: str2Date
}