function morningBrief() {
  var data = SpreadsheetApp.openById(MACRO_FILE_ID).getRange('2:2').getValues()[0]
  var today = new Date() // GMT-8
  today.setHours(today.getHours() + 16); // to GMT+8
  var todayStr = String(today.getFullYear()) + "-" + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0')
  if(data[0] != todayStr){
    var message = "Cannot find data of today!"
  }else{
    var message = "Greed/Fear Index: {0} ({1})\nDelta: {2}%\nPositive：{3}\nNegative：{4}".format(data[1], data[2], data[3]*100, data[9], data[7])
  }
  pusher(message)
}
