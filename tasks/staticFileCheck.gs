function task_staticFileCheck(){
  // Check if market closed
  if(!checkifClosed()) return;
  
   var files = DriveApp.getFolderById(STATIC_FILE_ID).getFiles()
   var msgLst = []
   while (files.hasNext()) {
     var file = files.next()
     var fileName = file.getName()
     if(fileName.match(/static|Logger/)){
       var updatedTime = file.getLastUpdated() // US Time
       updatedTime.setHours(updatedTime.getHours() + 16) // TW Time
       msgLst.push(formatDate(updatedTime) + " (" + fileName.replace(/_list|.txt|static_|Logger/g, '') + ")")
     }
   }
  var msg = truncate(("Static files updated_at:\n" + msgLst.toString().replace(/,/g, '\n')), 1000)
  Logger.log(msg)
  pusher(msg)
}
