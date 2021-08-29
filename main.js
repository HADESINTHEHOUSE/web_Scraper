const cherrio = require("cheerio");
const request = require("request");
const allmatch =require("./allmatch")
const fs =require("fs");
const path =require("path");
//main page
let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595"
const  ipath =path.join(__dirname,"ipl_matches")
makdir(ipath)
request(url, function (err, respone, body) {
    if (err) {
        console.log(err)
        return
    }

    handle(body)

})

//matches
function handle(html) {
    let $ = cherrio.load(html);
    let mlink = $("a[data-hover='View All Results']").attr("href");
    mlink = "https://www.espncricinfo.com" + mlink;
  //  console.log(mlink);

    allmatch.allmatchL(mlink);
}


function makdir(dpath)
{
if(fs.existsSync(dpath)==false)
{
    fs.mkdirSync(dpath)
}
}



