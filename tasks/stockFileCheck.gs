function task_stockFileCheck() {
  // Check if market closed
  if(!checkifClosed()) return;
  
  var files = DriveApp.getFolderById(STOCK_FILE_ID).getFiles()
  var today = new Date()
  today.setHours(today.getHours() + 16)
  Logger.log("Today: " + today)
  var fileNotUpdatedLst = [], latestDateWrongLst = []
  while (files.hasNext()) {
    var file = files.next()
    var fileName = file.getName()
    
    var updatedTime = file.getLastUpdated() // US Time
    updatedTime.setHours(updatedTime.getHours() + 16) // TW Time
    if(updatedTime.getDate() != today.getDate()) fileNotUpdatedLst.push(fileName)

    var sheet = SpreadsheetApp.openById(file.getId())
    var lastDate = new Date(sheet.getRange('A2').getValue().replace(/年|月/g, '-').replace(/日/g, ''))
    lastDate.setHours(lastDate.getHours() + 16) // TW Time

    if(lastDate.getDate() != today.getDate()){
      var failMsg = fileName + ' stoped at ' + (lastDate.getMonth()+1) + '/' + lastDate.getDate()
      latestDateWrongLst.push(failMsg)
    }
  }
  
  if(fileNotUpdatedLst.length != 0 ){
    var notUpdatedMsg = truncate(("File Not Updated: " + fileNotUpdatedLst.toString().replace(/,/g, '\n')), 1000)
    Logger.log(notUpdatedMsg)
    pusher(notUpdatedMsg)
  }else{
    pusher("All files are updated today!")
  }
  
  if(latestDateWrongLst.length != 0 ){
    var lastDayWrongMsg = truncate(("Last Date Wrong:\n" + latestDateWrongLst.toString().replace(/,/g, '\n')), 1000)
    Logger.log(lastDayWrongMsg)
    pusher(lastDayWrongMsg)
  }else{
    pusher("All files are correct!")
  }
  
  Logger.log("File Iter Ended!")
}
