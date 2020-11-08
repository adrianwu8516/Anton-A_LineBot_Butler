function truncate(str, n){
  return (str.length > n) ? str.substr(0, n-1) + '...' : str;
};

function formatDate(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return (date.getMonth()+1) + "/" + date.getDate() + " " + strTime; //+ "/" + date.getFullYear() + 
}

String.prototype.format = function ()
{
    var txt = this.toString();
    for (var i = 0; i < arguments.length; i++)
    {
        var exp = getStringFormatPlaceHolderRegEx(i);
        txt = txt.replace(exp, (arguments[i] == null ? "" : arguments[i]));
    }
    return cleanStringFormatResult(txt);
}

function getStringFormatPlaceHolderRegEx(placeHolderIndex){
  return new RegExp('({)?\\{' + placeHolderIndex + '\\}(?!})', 'gm')
}

function cleanStringFormatResult(txt){
  if (txt == null) return "";
  return txt.replace(getStringFormatPlaceHolderRegEx("\\d+"), "");
}

function pusher(message) {
  var url = 'https://api.line.me/v2/bot/message/push';
  UrlFetchApp.fetch(url, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'to':  LINE_USER_ID,
      'messages': [{
        type:'text',
        text:message
      }]
    }),
  });  
}

function replier(replyToken, replyMessage){
  var url = 'https://api.line.me/v2/bot/message/reply';
  UrlFetchApp.fetch(url, {
      'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': [{
        'type': 'text',
        'text': replyMessage,
      }],
    }),
  });
}

function doPost(e) {
  var msg = JSON.parse(e.postData.contents);

  // 取出 replayToken 和發送的訊息文字
  var replyToken = msg.events[0].replyToken;
  if (typeof replyToken === 'undefined') return;
  
  var userId = msg.events[0].source.userId;
  var userMessage = msg.events[0].message.text;
  
  if(userId != LINE_USER_ID){
    replier(replyToken, "Sorry, you have no permission to do this")
  }else{
    if(userMessage.match(/MC/)){
      remoteMissionControl(userMessage, replyToken)
    }else{
      replier(replyToken, "Don't Know what you mean, sir!")
    }
  }
}


SPECIFICCLOSEDAY = ['2020-1-2', '2020-1-21', '2020-2-18', '2020-4-11', '2020-5-26', '2020-7-4', '2020-9-8', '2020-11-27', '2020-12-26']

//Stop if the market is closed!
function checkifClosed(){
  var today = new Date();
  if(today.getDay() < 2){Logger.log("Market Closed!");return;}
  var todayString = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate()
  if(SPECIFICCLOSEDAY.includes(todayString)){Logger.log("Holiday!");return;}
  return todayString
}