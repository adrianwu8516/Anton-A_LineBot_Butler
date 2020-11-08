function remoteMissionControl(userMessage) {
  userMessage = userMessage.replace('MC', '')
  const baseUrl = 'https://script.google.com/macros/s/AKfycbwHqrLyBUTz6YrfDgL10LCOKoaLozcJsdg8ClPmUTLJG-HyOfc/exec?mode=missionControl&task='
  if(userMessage.match("parser")){
    var url = baseUrl + 'PARSER_PACKAGE'
  }else if(userMessage.match("parserR")){
    var url = baseUrl + 'RECORDER_PACKAGE'
  }else if(userMessage.match("refresh")){
    var url = baseUrl + 'REGENERATELOG'
  }else if(userMessage.match("guru")){
    var url = baseUrl + 'dailyGuruFocus'
  }else if(userMessage.match("guruR")){
    var url = baseUrl + 'dailyGuruFocusRecord'
  }else if(userMessage.match("crossLog")){
    var url = baseUrl + 'genCrossDateLog'
  }else if(userMessage.match("fix")){
    var url = baseUrl + 'fixMissingValueInSheet'
  }else{
    return 'Mission control cannot identify the order'
  }
  UrlFetchApp.fetch(url)
  return "On My Way, Sir"
}
