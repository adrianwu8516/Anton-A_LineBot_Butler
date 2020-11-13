function urlParseMission(userMessage = 'GET fg', replyToken) {
  userMessage = userMessage.replace('GET', '')
  if(userMessage.match(/fg|Fg|FG/)){
    var xml = UrlFetchApp.fetch('https://money.cnn.com/data/fear-and-greed/').getContentText();
    var CNNNow = parseInt(xml.replace(/[\s\S]*?Greed Now: ([0-9]*?) \(([\s\S]*?)\)[\s\S]*/, '$1'))
    var CNNNowSymbol = xml.replace(/[\s\S]*?Greed Now: ([0-9]*?) \(([\s\S]*?)\)[\s\S]*/, '$2')
    var CNNYest = parseInt(xml.replace(/[\s\S]*?Close: ([0-9]*?) [\s\S]*/, '$1'))
    var message = "Greed/Fear Index: {0} ({1})\nDelta: {2}%".format(CNNNow, CNNNowSymbol, Math.round((CNNNow - CNNYest)/CNNYest * 100))
  }else{
    replier(replyToken, 'URL parser cannot identify the order')
    return 
  }
  replier(replyToken, message)
  return 
}
