function pttPotentialStockParser() {
  let postObj = {};
  let replyStr = "昨日PTT熱門標的：\n"
  const baseUrl = 'https://www.ptt.cc/';
  let targetUrl = 'bbs/Stock/index.html';
  
  // Set Time Control
  let latestDate = new Date() // GMT-8
  latestDate.setHours(latestDate.getHours() + 16); // to GMT+8
  const thisYear = latestDate.getFullYear()
  const endDate = new Date().setDate(latestDate.getDate()-1); // Only fetch the lasest data within 2 days
  
  while(latestDate > endDate){
    let xml = UrlFetchApp.fetch(baseUrl + targetUrl).getContentText();
    targetUrl = xml.replace(/[\s\S]*?最舊<\/a>[\s]*<a class="btn wide" href="([\s\S]*?)">&lsaquo; 上頁<\/a>[\s\S]*/, '$1')
    let titleLst = xml.match(/<div class="title">[\s]*?<a href="([\s\S]*?)">([\s\S]*?)<\/a>[\s\S]*?<div class="date">([\s\S]*?)<\/div>/g)
    for(let no in titleLst){
      let postUrl = titleLst[no].replace(/<div class="title">[\s]*?<a href="([\s\S]*?)">([\s\S]*?)<\/a>[\s\S]*?<div class="date">([\s\S]*?)<\/div>/, '$1')
      let title = titleLst[no].replace(/<div class="title">[\s]*?<a href="([\s\S]*?)">([\s\S]*?)<\/a>[\s\S]*?<div class="date">([\s\S]*?)<\/div>/, '$2')
      
      //Fetch created date of each post, so that we can tell when should we stop crawling
      let date = titleLst[no].replace(/<div class="title">[\s]*?<a href="([\s\S]*?)">([\s\S]*?)<\/a>[\s\S]*?<div class="date">([\s\S]*?)<\/div>/, '$3') 

      postObj[postUrl] = {title: title, date:date}
      //Logger.log(postObj[postUrl])
      
      // Pass 置底公告 and 閒聊區
      if(title.includes('公告') || title.includes('閒聊') || title.includes('行事曆')) continue;
      
      // The "latestDate" showes that any data before this date has been processed
      latestDate = Date.parse(thisYear + '/' + date)
    }
  }
  
  for(let postUrl in postObj){
    let postDetail = postObj[postUrl]
    
    // If this is a "標的文" then start further analyzation
    if(postDetail.title.includes('標的')){
      let postContent = UrlFetchApp.fetch(baseUrl + postUrl).getContentText();
      let potentialScore = 0
      // Examine comments and see if there is the target string '低調'
      let commentLst = postContent.match(/<span class="f3 push-content">[\s\S]*?<\/span>/g)
      for(let commentNo in commentLst){
        if(commentLst[commentNo].includes('低調')) potentialScore += 1
      }
      // Set Mail Content
      let str = "【{1}】{0}\n".format(postObj[postUrl].title.replace(/\[標的\]|Re: /g, ''), potentialScore)
      replyStr = replyStr + str
    }
  }
  replyStr = replyStr + '\nCheck it yourself:\nhttps://www.ptt.cc/bbs/Stock/index.html'
  if(replyStr != "昨日PTT熱門標的：\n") pusher(replyStr)
}