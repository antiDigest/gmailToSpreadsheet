function fillSpreadsheet() {
  getGmailData_(getGmails_(), getSpreadsheet_());
}

function getGmailData_(threads, sheet) {
  for(var t=threads.length-1; t>=0; t--) {
    var thread = threads[t];
    if (!thread.isUnread()) {
      continue;
    }
    var rows = extractMoreInfo_(thread);
    for(var r=0; r<rows.length; r++) { 
      var row = rows[r];
      sheet.appendRow(row);
      highlightRow_(sheet, row);
    } 
    // thread.markRead();
    break;
  }
}

function getGmails_() {
  var threads = GmailApp.search("label:investing-robinhood");
  
  var start = binarySearch_(threads, 0, threads.length-1);
  if (start+5 < threads.length) {
    start = start+5;
  }

  return threads.slice(0, start+1);
}

function getSpreadsheet_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("Invest Log");
  return sheet;
}

function extractMoreInfo_(thread) {
  var messages = thread.getMessages();
  var rows = [];
  
  for(var m=0; m<messages.length; m++) {
    var message = messages[m];
    // Logger.log("Now extracting more info from: " + message.getSubject());
    var subject = message.getSubject();
    var mailFrom = message.getFrom();
    if (mailFrom.indexOf("Snacks") > -1) {
      break;
    }
    
    var body = message.getBody();
    var bodyHtml = replaceUselessTags_(body);
    // if (subject== "Order Placed") {
    //   body = doGet(bodyHtml);
    // } else if (subject == "Order Executed") {
    //   body = doGet(bodyHtml);
    // }
    try{
      body = parseHtml_(bodyHtml);
      body = getAllText_(body);

      body = getAllSentences_(body);

      var sentenceToParse = null;
      for (var i=0; i<body.length; i++) {
        if (body[i].indexOf("share") > -1) {
          sentenceToParse = body[i];
        } else if (body[i].indexOf("$") > -1) {
          sentenceToParse = body[i];
        }
      }

      body = body.join(" :: ");
    } catch (Exception) {
      body = subject;
    }
    
    rows.push([message.getDate(), thread.getId(), message.getId(), subject, mailFrom, sentenceToParse, body]);
  }
  
  return rows;
}

function parseHtml_(html) {
  var doc = XmlService.parse(html);
  // var menu = getAllText_(doc.getRootElement()).join(" :: ");
  // return menu;
  return doc;
}

function highlightRow_(sheet, row) {
  if (row[3] == row[row.length-1]) {
    highlightRow_(sheet, row, "fc6e4e");
  } else if (row[4].indexOf("notification") > -1) {
    highlightRow_(sheet, row, "fcc900");
  }
}

function highlightRow_(sheet, row, color) {
  var sheetRow = sheet.getLastRow();
  var sheetCol = sheet.getLastColumn();
  var rowRange = sheet.getRange(sheetRow, 1, 1, row.length);
  rowRange.setBackground(color);
}

function replaceUselessTags_(body) {
  var regex = new RegExp('<!--.*-->', 'gm');
  var formattedBody = body.replace(regex,"");
  var bodyRegex = new RegExp(/<body[\s\S]*<\/body>/gi);
  var bodyHtml = formattedBody.match(bodyRegex)[0];

  var imgRegex = new RegExp(/<img([\s\S]*?)>/gi);
  bodyHtml = bodyHtml.replace(imgRegex, "");
  var brRegex = new RegExp(/<br([\s\S]*?)>/gi);
  bodyHtml = bodyHtml.replace(brRegex, "");

  bodyHtml = bodyHtml.replace(/&/g, "&amp;");
  // Logger.log(bodyHtml);

  return bodyHtml;
}

function getAllText_(element) {  
  var data = [];
  var descendants = element.getDescendants();
  descendants.push(element);  
  for(i in descendants) {
    var elt = descendants[i].asElement();
    try {
      var elementText = elt.getText();
      if (elementText != null && elementText != "") {
        elementText = elementText.trim();
        if (elementText != "") {
          data.push(elementText);
        }
        if (elementText.indexOf("The Robinhood Team") > -1) {
          return data;
        }
      }
    } catch (TypeError) {
      continue;
    }
  }
  return data;
}

function getAllSentences_(paras) {

  Logger.log(paras);

  var sentences = [];
  var sentenceRegex = new RegExp("(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s");
  for (var i=0; i<paras.length; i++) {

    var interSentences = paras[i].split(sentenceRegex, "g");
    interSentences.foreach(function(inter){
      sentences.push(inter);
    });
  }

  Logger.log(sentences);
  return sentences;
}

function binarySearch_(threads, start, end){
  var veryEnd = end;
  var mid = 0;
  while (start <= end) {
    mid = parseInt((start+end)/2);
    if (mid == veryEnd) {
      return mid;
    }
    if (threads[mid].isUnread() && !threads[mid+1].isUnread()) {
      return mid;
    } else if (threads[mid].isUnread() && threads[mid+1].isUnread()) {
      start = mid+1;
    } else {
      end = mid;
    }
  }
  return end;
}





