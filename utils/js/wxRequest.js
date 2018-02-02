
const wxPromise = require('./wxPromise.js');
function wxRequest() {
 var aArguments=Array.prototype.slice.call(arguments);
 var oParams = {
   header: {
     'Content-Type': 'application/json;charset=UTF-8',
     'v':"1.0"
   },
 };
 if (aArguments.length==1){
   oParams.url = aArguments[0].url;
   oParams.method = aArguments[0].method||"POST";
   oParams.data = aArguments[0].data||{};
 }else if (aArguments.length ==2) {
   oParams.url = aArguments[0];
   oParams.method ="POST";
   oParams.data = aArguments[1]||{};
 } else if (aArguments.length == 3){
   oParams.url = aArguments[0];
   oParams.method = aArguments[1];
   oParams.data = aArguments[2]||{};
 };
  oParams.data.v=1.0;
  var wRequest = wxPromise(wx.request);
  return wRequest(oParams);
}

module.exports =wxRequest;
