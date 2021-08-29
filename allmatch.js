const cherrio = require("cheerio");
const request = require("request");
const sco =require("./scorecard")

function allmatches(mlink)
{
request(mlink, function (err, respone, body) {
    if (err) {
        console.log(err)
        return
    }

    handleml(body)

})
}

function handleml(html) {
    let $ = cherrio.load(html);
    let sclink = $("a[data-hover='Scorecard']");
    for (let i = 0; i < sclink.length; i++) {
        let flink = $(sclink[i]).attr("href");
        flink = "https://www.espncricinfo.com" + flink;
       console.log(flink);
        
       sco.scard(flink);
    }
}





module.exports={
    allmatchL:allmatches

}
