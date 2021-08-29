const cherrio = require("cheerio");
const request = require("request");
const fs =require("fs");
const path =require("path");
const xlsx = require("xlsx");
//main page
//let url ="https://www.espncricinfo.com/series/ipl-2020-21-1210595/rajasthan-royals-vs-chennai-super-kings-4th-match-1216496/full-scorecard"
function scoCard(url)
{
request(url, function (err, respone, body) {
    if (err) {
        console.log(err)
        return
    }

    handle(body)

})
}
function handle(html) {
    let $ = cherrio.load(html);
   
    let desc=$(".event .description")
    let res =$(".event .status-text span");
    let de =desc.text();
    let arr=de.split(",");
    let venue=arr[1].trim();
    let date =arr[2].trim();
    let result=res.text()
    let card=$(".card.content-block.match-scorecard-table>.Collapsible")
    //let ht =""
    for(let i=0;i<card.length;i++ )
    { 
let team=$(card[i]).find("h5").text();
team =team.split("INNINGS")[0].trim();
let oppinx = i==0?1:0;
let opteam =$(card[oppinx]).find("h5").text();
opteam =opteam.split("INNINGS")[0].trim();

let inn =$(card[i]);
let row =$(inn).find(".table.batsman tbody tr");
for(let j=0;j<row.length;j++)
{
    let col=  $(row[j]).find("td");
    let batsman =$(col[0]).hasClass("batsman-cell")
    if(batsman==true)
    {
let pname =$(col[0]).text().trim();
let runs =$(col[2]).text().trim();
let balls =$(col[3]).text().trim();
let fours =$(col[5]).text().trim();
let sixes =$(col[6]).text().trim();
let str =$(col[7]).text().trim();
process(team,pname,runs,balls,fours,sixes,str,date,venue,result);
console.log(pname," ",runs," ",balls," ",fours," ",sixes," ",str);
    }
    

}

console.log(team," other team ",opteam ,"vneue:",venue,"date",date,"result:",result);
    }
  //  console.log(ht);

}

function process(team,pname,runs,balls,fours,sixes,str,date,venue,result)
{
let tpath =path.join(__dirname,"ipl_matches",team);


makdir(tpath);
let pexcelt=path.join(tpath,pname +".xlsx")
let file=excelReader(pexcelt,pname)
let pobj={
    team,pname,runs,balls,fours,sixes,str,date,venue,result
}
file.push(pobj)
excelWriter(pexcelt,file,pname)



}
function makdir(dpath)
{
if(fs.existsSync(dpath)==false)
{
    fs.mkdirSync(dpath)
}
}



function excelWriter(filePath, json, sheetName) {

    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    xlsx.writeFile(newWB, filePath);
}
// // json data -> excel format convert
// // -> newwb , ws , sheet name
// // filePath
// read 
//  workbook get
function excelReader(filePath, sheetName) {
    if (fs.existsSync(filePath) == false) {
        return [];
    }
    let wb = xlsx.readFile(filePath);
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;

}



module.exports={
    scard:scoCard
}