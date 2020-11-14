function jobAlert() {
  const sheet = SpreadsheetApp.openById(JOB_STORAGE_FILE)
  const index = sheet.getSheetValues(3, 1, sheet.getLastRow()-2, 1).flat()
  const baseUrl = 'https://www.cakeresume.com/jobs?refinementList%5Bprofession%5D%5B0%5D=tech_project-product-management&page='
  let matchLst = [""]
  let pageNo = 1
  let replyStr = "發現了新的高薪職缺：\n"
  while(pageNo < 20){
    let xml = UrlFetchApp.fetch(baseUrl + pageNo).getContentText();
    let matchLst = xml.match(/{"title":[\s\S]*?}}}}/g)
    if(!matchLst) break;
    matchLst = matchLst.map(item => JSON.parse(item))
    for(let no in matchLst.slice(0,10)){
      if(!(index.includes(matchLst[no].path))){
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
          let str = "公司名稱：{0}\n職稱：{1}\n薪水區間：{2}~{3}萬({4})\n去看看：\nhttps://www.cakeresume.com/companies/{5}/jobs/{6}\n".format(
            matchLst[no].page.name, matchLst[no].title, 
            parseInt(matchLst[no].salary_min)/10000, parseInt(matchLst[no].salary_max)/10000,
            matchLst[no].salary_type.replace('per_', ''), matchLst[no].page.path, matchLst[no].path
          )
          replyStr = replyStr + str
        }
      }
    }
    pageNo += 1 
  }
  Logger.log(replyStr)
  pusher(replyStr)
}