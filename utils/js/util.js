var formatTime = function (date, formater) {
  formater = formater || "yyyy-MM-dd hh:mm:ss";
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

var formatNumber = function (n) {
  n = n.toString();
  return n[1] ? n : '0' + n;
}
module.exports = {
  formatTime: formatTime
}