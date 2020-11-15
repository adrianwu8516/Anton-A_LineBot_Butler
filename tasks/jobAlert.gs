function jobAlert_CakeResume() {
  const sheet = SpreadsheetApp.openById(JOB_STORAGE_FILE).getSheetByName("CakeResume")
  const index = sheet.getSheetValues(3, 1, sheet.getLastRow()-2, 1).flat()
  const baseUrl = 'https://www.cakeresume.com/jobs?refinementList%5Bprofession%5D%5B0%5D=tech_project-product-management&page='
  let matchLst = [""]
  let pageNo = 1
  let replyStr = "CakeResume中，發現高薪工作：\n"
  while(pageNo < 20){
    let xml = UrlFetchApp.fetch(baseUrl + pageNo).getContentText();
    let matchLst = xml.match(/{"title":[\s\S]*?}}}}/g)
    if(!matchLst) break;
    matchLst = matchLst.map(item => JSON.parse(item))
    for(let no in matchLst.slice(0,10)){
      if(index.includes(matchLst[no].path)) continue;
      sheet.insertRowAfter(2);
      sheet.getRange('A3:AE3').setValues([[
        matchLst[no].path, 
        matchLst[no].page.name,
        matchLst[no].page.number_of_employees,
        matchLst[no].title,
        matchLst[no].requirements,
        matchLst[no].tag_list,
        matchLst[no].location_list,
        matchLst[no].created_at,
        matchLst[no].expired_at,
        matchLst[no].work_experience_list,
        matchLst[no].job_function_list,
        matchLst[no].category,
        matchLst[no].job_type,
        matchLst[no].seniority_level,
        matchLst[no].salary_type,
        matchLst[no].salary_currency,
        matchLst[no].number_of_openings,
        matchLst[no].lang_name,
        matchLst[no].profession,
        matchLst[no].remote,
        matchLst[no].description_plain_text,
        matchLst[no].requirements_plain_text,
        matchLst[no].salary_min,
        matchLst[no].salary_max,
        matchLst[no].salary_range,
        matchLst[no].salary_score,
        matchLst[no].content_updated_at,
        matchLst[no].fresh_score,
        matchLst[no].unique_impressions_count_score,
        matchLst[no].up_votes_score,
        matchLst[no].job_applications_count_score
      ]])
      let highYearPay = matchLst[no].salary_type == 'per_year' && parseInt(matchLst[no].salary_min) > 1000000
      let highMonthlyPay = matchLst[no].salary_type == 'per_month' && parseInt(matchLst[no].salary_min) > 80000
      if (highYearPay || highMonthlyPay || parseInt(matchLst[no].salary_score) > 3){
        let str = "🏢：{0}\n💼：{1}\n💰：{2}~{3}萬({4})\nCheck it out：\nhttps://www.cakeresume.com/companies/{5}/jobs/{6}\n\n".format(
          matchLst[no].page.name, matchLst[no].title, 
          parseInt(matchLst[no].salary_min)/1000, parseInt(matchLst[no].salary_max)/1000,
          matchLst[no].salary_type.replace('per_', ''), matchLst[no].page.path, matchLst[no].path
          )
          replyStr = replyStr + str
      }
    }
    pageNo += 1 
  }
  Logger.log(replyStr)
  if(replyStr != "CakeResume中，發現高薪工作：\n") pusher(replyStr)
}


function jobAlert_MeetJobs(){
  const sheet = SpreadsheetApp.openById(JOB_STORAGE_FILE).getSheetByName("MeetJobs")
  const index = sheet.getSheetValues(3, 1, sheet.getLastRow()-2, 1).flat()
  let pageNo = 1
  let lst = [""]
  let replyStr = "MeetJobs中，發現高薪工作：\n"
  while(lst && pageNo < 2){
    let url = 'https://api.meet.jobs/api/v1/jobs?page={0}&order=salary&q=Product%20Manager&include=required_skills&external_job=true'.format(pageNo)
    let xml = UrlFetchApp.fetch(url).getContentText();
    lst = JSON.parse(xml).collection
    if(!lst) return
    for(let no in lst){
      if(index.includes(lst[no].id)) continue;
      if(lst[no].title.includes(/Developer|developer|Engineer|engineer/)) continue;
      sheet.insertRowAfter(2);
      sheet.getRange('A3:J3').setValues([[
        lst[no].id, 
        lst[no].title,
        lst[no].external_employer_name,
        lst[no].salary.currency,
        lst[no].salary.minimum,
        lst[no].salary.maximum,
        lst[no].salary.paid_period_key,
        lst[no].address.handwriting_city,
        lst[no].published_at, 
        lst[no].updated_at
      ]])
      let str = "🏢：{0}\n💼：{1}\n💰：{2}~{3}萬{4}({5})\n🏙：{6}\nCheck it out：\nhttps://meet.jobs/zh-TW/jobs/{7}\n\n".format(
        lst[no].external_employer_name, lst[no].title,
        lst[no].salary.minimum/10000, lst[no].salary.maximum/10000,
        lst[no].salary.currency, lst[no].salary.paid_period_key,
        lst[no].address.handwriting_city,
        lst[no].id
      )
      replyStr = replyStr + str
    }
    pageNo += 1
  }
  Logger.log(replyStr)
  if(replyStr != "MeetJobs中，發現高薪工作：\n") pusher(replyStr)
}