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
    if(userMessage.match(/RUN/)){
      remoteMissionControl(userMessage, replyToken)
    }else if(userMessage.match(/GET/)){
      urlParseMission(userMessage, replyToken)
    }else if(userMessage.match(/parser|Parser/)){
      parserMenu(replyToken)
    }else if(userMessage.match(/log|Log/)){
      logMenu(replyToken)
    }else{
      replier(replyToken, "Don't Know what you mean, sir!")
    }
  }
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

function parserMenu(replyToken){
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
        "type": "template",
        "altText": "This is a menu for mission control",
        "template": {
          "type": "buttons",
          "thumbnailImageUrl": "https://2.bp.blogspot.com/-H2eLSLfzvpA/XGjx1UapC6I/AAAAAAABRcA/5Xdh-W7tqk8X1YONndv2B1ykhJ6BRS1bgCLcBGAs/s800/ai_computer_sousa_robot.png",
          "imageAspectRatio": "square",
          "imageSize": "cover",
          "imageBackgroundColor": "#FFFFFF",
          "title": "Mission Control",
          "text": "You can remote control the parser and cache service here！",
          "actions": [
            {
              "type":"message",
              "label":"PARSER_PACKAGE",
              "text":"RUN parser"
            },
            {
              "type":"message",
              "label":"RECORDER_PACKAGE",
              "text":"RUN parserR"
            },
            {
              "type":"message",
              "label":"GuruFocus",
              "text":"RUN guru"
            },
            {
              "type":"message",
              "label":"GuruFocusRecord",
              "text":"RUN guruR"
            }
          ]
        }
      }],
    }),
  });
}

function logMenu(replyToken){
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
        "type": "template",
        "altText": "This is a menu for mission control",
        "template": {
          "type": "buttons",
          "thumbnailImageUrl": "https://1.bp.blogspot.com/-QgQV1hHADHQ/V0QnaOZIQnI/AAAAAAAA64c/YYew-pIBHd8V3Wb0l8xGDWs1PF9eUoq0QCLcB/s400/computer_mukashi_.png",
          "imageAspectRatio": "square",
          "imageSize": "cover",
          "imageBackgroundColor": "#FFFFFF",
          "title": "Log Control",
          "text": "You can remote control the parser and cache service here！",
          "actions": [
            {
              "type":"message",
              "label":"REGENERATELOG",
              "text":"RUN refresh"
            },
            {
              "type":"message",
              "label":"genCrossDateLog",
              "text":"RUN crossLog"
            },
            {
              "type":"message",
              "label":"fixMissingValue",
              "text":"RUN fix"
            },
            {
              "type":"uri",
              "label":"View Site",
              "uri":"https://sites.google.com/view/us-stock-today/home"
            }
          ]
        }
      }],
    }),
  });
}