var scrapedData = []; // array of the scraped table of data
var standingsStatisticsRow = [];// the last row of the table
var headersNum = -1;// number of headers in the table determined by the first row of the table (number of questions)

//thing to be done only once
//url of the contest standings page(insert it manually)
var cFURL = "https://codeforces.com/group/CtnTbIORWX/contest/380610/standings/groupmates/true";
//url of the google sheet (insert it manually)
var ssURL = "https://docs.google.com/spreadhttps://docs.google.com/spreadsheets/d/1NLfIOvInWfPNbbY0zU82aW-W1IYoEUiHRow-OSbh_NA/edit#gid=1083666586";
//name of the sheet which is the name of the contest (insert it manually)
var sssName = 'Contest#7';
//cookie of the user (insert it manually). You can get it from the browser by pressing F12 and then going to the console and typing document.cookie
var cookie = "X-User-Sha1=f08d9390ddc7f0357ed203ecb989d8583cc6c653; RCPC=d8f5b5327bbc9fb1a1d1b020c29595c3; nocturne.language=en; 39ce7=CF4SeP94; evercookie_png=p48brts2wcfx1mw5n8; evercookie_etag=p48brts2wcfx1mw5n8; evercookie_cache=p48brts2wcfx1mw5n8; 70a7c28f3de=p48brts2wcfx1mw5n8; X-User=ef1faafef581d5c63f4d8ab70ab5cfe5bd1827c0a7f9959135ca728583f36f0c2724543e5da8a19c; lastOnlineTimeUpdaterInvocation=1677205126426"

// Open SpreadSheet and get the URL
let ss = SpreadsheetApp.openByUrl(ssURL);
var sheetName = sssName;
var dataSheet = ss.getSheetByName(sheetName);

// function to get the data from the table in the html page, called every time we update the sheet
function HTML_parser() {
    var h = UrlFetchApp.fetch(cFURL, {
        "headers": {
            "cookie": cookie
        }
    }).getContentText();
    const $ = Cheerio.load(h);

    // extract the data
    // let row = dataSheet.createTextFinder(h).findNext().getA1Notation();
    const tableHeaders = [];
    $(".standings > tbody > tr").each((index, element) => {
        if (index === 0) {
            const ths = $(element).find("th");
            $(ths).each((i, element) => {
                tableHeaders.push(
                    $(element).text().toLowerCase().replace('\n\n         ', ' ').trim()
                );
            });
            return true;
        }
        headersNum = tableHeaders.length;
        const tds = $(element).find("td");
        const tableRow = {};

        $(tds).each((i, element) => {
            tableRow[tableHeaders[i]] = $(element).text().trim().replaceAll('        ', ' ').replaceAll('\n', ' ').replaceAll('    ', '');
        });

        if (tableRow['#'] != '') {
            scrapedData.push(tableRow);
        }

        if (tableRow['who'] == 'AcceptedTried') {
            standingsStatisticsRow.push(tableRow);
            Logger.log('G!')
        }
    });
    Logger.log(headersNum)
    Logger.log(standingsStatisticsRow);
}

// function to initialize the sheet (called manually once only when the sheet is created)
function initiateSheet() {
    HTML_parser()
    headersNum++;

    //first line
    // dataSheet.setActiveRange(dataSheet.getRange(1, headersNum));
    dataSheet.getRange(1, 1, 1, headersNum).merge()
        .setVerticalAlignment('middle')
        .setHorizontalAlignment('center')
        .setBackground('#DBAA03')
        .setValue("🔥 TOP TEN 🔥");

    dataSheet.hideColumns(headersNum, 27 - headersNum);
    dataSheet.hideRows(13, 988);
    dataSheet.getRange(2, 1).setValue('#');
    dataSheet.setColumnWidth(1, 35);
    dataSheet.getRange(2, 2).setValue('contestant');
    dataSheet.setColumnWidth(2, 500);
    dataSheet.getRange(2, 3).setValue('probSolved');
    dataSheet.setColumnWidth(3, 200);
    dataSheet.getRange(2, 4).setValue('(penality)');
    dataSheet.setColumnWidth(4, 200);
    for (let i = 5; i < headersNum; i++) {
        dataSheet.getRange(2, i).setValue(String.fromCharCode(60 + i));
        dataSheet.setColumnWidth(i, 35);
    }
    var ndLineTxtStyle = SpreadsheetApp.newTextStyle()
        .setFontFamily("impact")
        .setFontSize(24)
        .setBold(true)
        .build();
    dataSheet.getRange(2, 1, 1, headersNum).setVerticalAlignment('middle').setHorizontalAlignment('center').setTextStyle(ndLineTxtStyle);
    dataSheet.getRange(3, 2, 12, headersNum)
        .setVerticalAlignment('middle')
        .setHorizontalAlignment('center');
    // Logger.log(scrapedData[]);
    // insertCellImage(dataSheet.getRange('A3'),"https://gallery.yopriceville.com/var/resizes/Free-Clipart-Pictures/Trophy-and-Medals-PNG/First_Place_Medal_Badge_Clipart_Image.png?m=1555462996","#1", "He is the best!")
}
// function to update the sheet (called every time we want to update the sheet (and ***it is the one which is called by the trigger***))
function updateSheet() {
    HTML_parser();
    for (let i = 0; i < 10; i++) {
        let nam = scrapedData[i]['who'];
        dataSheet.getRange(i + 3, 2).setValue(nam);
        // Logger.log(nam[nam.length-1]); 
        if (nam[nam.length - 1] === '#') {
            dataSheet.getRange(i + 3, 1, 1, headersNum).setBackground('red');
        } else {
            dataSheet.getRange(i + 3, 1, 1, headersNum).setBackground(null);
        }
        dataSheet.getRange(i + 3, 3).setValue(scrapedData[i]['=']);
        dataSheet.getRange(i + 3, 4).setValue(scrapedData[i]['penalty']);
        for (let j = 1; j < headersNum - 4; j++) {
            let tmp1 = String.fromCharCode(97 + j - 1);
            let tmp2 = scrapedData[i][tmp1];
            if (tmp2.length > 0) {
                tmp2 = tmp2.slice(0, tmp2.search(' '));
                dataSheet.getRange(i + 3, j + 4).setValue(tmp2);
            } else {
                dataSheet.getRange(i + 3, j + 4).setValue('');
            }
        }
    }
    var stFont = SpreadsheetApp.newTextStyle()
        .setBold(true)
        .setFontSize(30)
        .build();
    dataSheet.getRange(3, 1, 1, headersNum).setTextStyle(stFont);
    var ndFont = SpreadsheetApp.newTextStyle()
        .setBold(true)
        .setFontSize(20)
        .build();
    dataSheet.getRange(4, 1, 1, headersNum).setTextStyle(ndFont);
    var rdFont = SpreadsheetApp.newTextStyle()
        .setBold(true)
        .setFontSize(15)
        .build();
    dataSheet.getRange(5, 1, 1, headersNum).setTextStyle(rdFont);
}

// some numbers are stuck together, this function separates them
function treatStuckNumbers(a = 10099) {
    a = a.toString();
    t1 = a.slice(0, a.length / 2);
    t2 = a.slice(a.length / 2);
    return [t1, t2];
}

// function to insert an image in a cell (it is an acctual thing in google sheets)
function insertCellImage(range, imageUrl, altTitle = "", altDescription = "") {
    let image = SpreadsheetApp
        .newCellImage()
        .setSourceUrl(imageUrl)
        .setAltTextTitle(altTitle)
        .setAltTextDescription(altDescription)
        .build();
    range.setValue(image);
}