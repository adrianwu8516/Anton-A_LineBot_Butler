function izaaxPostCheck() {
  const sheet = SpreadsheetApp.openById(ARTICLE_BANK_FILE).getSheetByName("izaax")
  const index = sheet.getSheetValues(2, 1, sheet.getLastRow()-1, 1).flat()
  let postSet = {}
  postSet = izaaxPostHandlingUnit('http://www.izaax.net/blog/?page_id=1193', postSet, "智富專欄")
  postSet = izaaxPostHandlingUnit('http://www.izaax.net/blog/?page_id=7683', postSet, "財訊專欄")
  postSet = izaaxPostHandlingUnit('http://www.izaax.net/blog/?page_id=1197', postSet, "經濟分析")
  postSet = izaaxPostHandlingUnit('http://www.izaax.net/blog/?page_id=1199', postSet, "好文分享")
  postSet = izaaxPostHandlingUnit('http://www.izaax.net/blog/?page_id=1205', postSet, "週報選文")
  postSet = izaaxPostHandlingUnit('http://www.izaax.net/blog/?page_id=1988', postSet, "小J的美股專欄")
  postSet = izaaxPostHandlingUnit('http://www.izaax.net/blog/?page_id=1955', postSet, "網站公告")
  for(let post in postSet){
    if(index.includes(postSet[post].hash)) continue;
    sheet.insertRowAfter(1);
    sheet.getRange('A2:D2').setValues([[
      postSet[post].hash, postSet[post].date, postSet[post].type, postSet[post].title
    ]])
    let replyStr = "Izaax 發了新文章：\n{0}({1})".format(postSet[post].title, postSet[post].type)
    Logger.log(replyStr)
    pusher(replyStr)
  }
}

function izaaxPostHandlingUnit(url, postSet, type){
  let xmlLst = UrlFetchApp.fetch(url).getContentText().match(/<li>[\s\S]*?<\/li>/g)
  for(let no in xmlLst.slice(0, 5)){
    let title = xmlLst[no].replace(/[\s\S]*?title="([\s\S]*?)"[\s\S]*/, '$1').replace(/（公開文章）/, '')
    postSet[title] = {}
    postSet[title].title = title
    postSet[title].date = xmlLst[no].replace(/<li>([\s\S]*?)<[\s\S]*/, '$1').replace(" ", '')
    postSet[title].type = type
    postSet[title].hash = (postSet[title].date + title + type).hash()
  }
  return postSet
}

function beyondFangPostCheck(){
  const sheet = SpreadsheetApp.openById(ARTICLE_BANK_FILE).getSheetByName("美股軍師")
  const index = sheet.getSheetValues(2, 1, sheet.getLastRow()-1, 1).flat()
  const url = "https://www.beyondfang.com/"
  let xmlLst = UrlFetchApp.fetch(url).getContentText().match(/<article class="post excerpt">[\s\S]*?<\/article>/g)
  for(let no in xmlLst){
    let date = xmlLst[no].replace(/[\s\S]*?<div class="post-date-publishable">([\s\S]*?)<\/div>[\s\S]*/, '$1')
    let link = xmlLst[no].replace(/[\s\S]*?<a href="([\s\S]*?)"[\s\S]*?>([\s\S]*?)<\/a>[\s\S]*/, '$1')
    let title = xmlLst[no].replace(/[\s\S]*?<a href="([\s\S]*?)"[\s\S]*?>([\s\S]*?)<\/a>[\s\S]*/, '$2')
    let hash = (date + link + title).hash()
    if(index.includes(hash)) continue;
    sheet.insertRowAfter(1);
    sheet.getRange('A2:D2').setValues([[
      hash, date, title, link
    ]])
    let replyStr = "美股軍師發了新文章：\n{0}\nCheck it Out:\n{1}".format(title, link)
    Logger.log(replyStr)
    pusher(replyStr)
  }
}