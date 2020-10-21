const fs = require('fs'),
readline = require('readline'),
LineByLineReader = require('line-by-line'),
Queue = require('better-queue'),
cheerio = require('cheerio');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

let q = new Queue(function(input, cb) {
    console.log("Working on book: "+input)
    input.forEach(id => {
        crawl(id,cb())});
    },
    { batchSize: 1, afterProcessDelay: 5000 
});

let stop = false
let forbiddenSet = new Set()
let writtenSet = new Set()
let primaryEditionsSet = new Set()

const addtoFile = (url, primaryEdURL) => {
    fs.open("./Data/webpages.txt")
    fs.appendFile(primaryEdURL+"  "+ url +"\n")
    console.log("move along nothing to see here")
}

const saveFile = (text,fileName) =>{
    fs.writeFile("D:/School/VINF/Data/"+fileName+".html",text , function (err) {
        if (err) throw err;
        console.log('Saved book with id: '+ fileName);
      }); 
}

const addAllEditions = (editions) => {
    var primaryEd = edditions[0]
    editions.forEach((edition, index) => {
        if (!writtenSet.has(edition.url)){
            writtenSet.add(edition.url)
            addtoFile(eddition, primaryEd)
        }
    })
    console.log("move along nothing to see here")
}

const addSimmilarBooksToQueue = (books) => {
    books.forEach((book, index) => {
        if (!writtenSet.has(book.url)){
            writtenSet.add(book.url)
            q.push(book)
        }
    })
    console.log("move along nothing to see here")
}

const crawl = (url, cb) => {
    // console.log("crawl")
    var request = new XMLHttpRequest();
    var res;
    request.open("GET", "https://www.goodreads.com/book/show/"+url);
    request.onreadystatechange = function() { 
        if (request.readyState === 4 && request.status === 200) {
            const $ = cheerio.load(request.responseText);
            saveFile(request.responseText, url)
            var list = $('ul .cover > a')
            var pageId
            for (const key in  list) {
                // console.log($(list[key]).attr('href'))
                if (key==16)
                    break
                if(pageId=$(list[key]).attr('href')!="undefined"){
                    pageId=$(list[key]).attr('href').split("show/")
                    pageId=pageId[1].split("-")
                    pageId=pageId[0].split(".")

                    // console.log(pageId[0])
                    if (!writtenSet.has(pageId[0]) && !forbiddenSet.has(pageId[0]) ){
                        // console.log(pageId[0])
                        // console.log(pageId[0])
                        q.push(pageId[0])
                        writtenSet.add(pageId[0])    
                    }
                    // if(url==13496)
                        // stop=true
                }
            }
            
                // addAllEditions(request.responseXML.editions)
                // addSimmilarBooksToQueue(request.responseXML.simmilar)
                // q.push(request.responseXML.simmilar[0])
        }
    };
    request.send(null);
    // console.log(res)
}

const fillListWithForbiddenURLS = (url) => {
    lr = new LineByLineReader(url)
    try {
        lr.on('line', async function(line) {
            lr.pause()
            forbiddenSet.add(line)
            lr.resume()
            // console.log(line)
        });
        lr.on('end', function() {
            console.log("Forbidden url successfully saved")
        })
    } catch (err) {
        console.log(err)
    }
}

fillListWithForbiddenURLS("forbidden.txt")
writtenSet.add(7235533)
crawl(7235533)

// files.forEach((file, index) => {
    // q.push(`D:/School/PDT/XXX/${file}`)
// })