function task_stockFileCheck() {
  // Check if market closed
  if(!checkifClosed()) return;
  
  var files = DriveApp.getFolderById(STOCK_FILE_ID).getFiles()
  var today = new Date()
  
  var fileNotUpdatedLst = [], latestDateWrongLst = []
  while (files.hasNext()) {
    var file = files.next()
    var fileName = file.getName()
    Logger.log(fileName)
    
    var lastUpdate = file.getLastUpdated()
    if(lastUpdate.getDate() != today.getDate()) fileNotUpdatedLst.push(fileName)

    var sheet = SpreadsheetApp.openById(file.getId())
    var lastDate = new Date(sheet.getRange('A2').getValue().replace(/年|月/g, '-').replace(/日/g, ''))
    if(lastDate.getDate() != today.getDate()){
      var failMsg = fileName + ' stops at ' + (lastDate.getMonth()+1) + '/' + lastDate.getDate()
      latestDateWrongLst.push(failMsg)
    }
  }
  
  var notUpdatedMsg = truncate(("File Not Updated: " + fileNotUpdatedLst.toString().replace(/,/g, '\n')), 1000)
  var lastDayWrongMsg = truncate(("Last Date Wrong:\n" + latestDateWrongLst.toString().replace(/,/g, '\n')), 1000)
  Logger.log(notUpdatedMsg)
  Logger.log(lastDayWrongMsg)
  pusher(notUpdatedMsg)
  pusher(lastDayWrongMsg)
  Logger.log("File Iter Ended!")
}
