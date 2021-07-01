var columns = ["Year", "Month", "Day", "DayOfWeek", "DateTime", "Time", "Amount", "Merchant", "Category", "Timeline", "Card", "Last4"]

function fillSpreadsheet() {
  getGmailData_(getGmails_("label:expenses"), getSpreadsheet_());
}

function getGmailData_(threads, sheet) {
  for(var t=threads.length-1; t>=0; t--) {
    var thread = threads[t];
    if (!thread.isUnread()) {
      continue;
    }
    var rows = extractMoreInfo_(thread);
    fillSpreadsheet_(rows, sheet);
    sendText(rows, columns);
    // thread.markRead();
    deleteForever_(thread);
    // break;
  }
}

function deleteForever_(thread) {
  thread = thread.moveToTrash();
  Gmail.Users.Messages.remove("me", thread.getId());
}

function getGmails_(label) {
  var threads = GmailApp.search(label);
  
  var start = binarySearch_(threads, 0, threads.length-1);
  if (start+5 < threads.length) {
    start = start+5;
  }

  return threads.slice(0, start+1);
}

function extractMoreInfo_(thread) {
  var messages = thread.getMessages();
  var rows = [];
  
  for(var m=0; m<messages.length; m++) {
    var message = messages[m];
    var sender = defineSender_(message);

    var row = {};
    if (sender == "Discover") {
      var sentences = askParserToParseBody_(message.getBody(), "1-800-DISCOVER");
      row = processWhenAccountIsDiscover_(message, sentences, row);
    } else if (sender == "CitiDoubleCash") {
      var sentences = askParserToParseBody_(message.getBody(), "Your Citi Team");
      row = processWhenAccountIsCiti_(message, sentences, row);
    } else if (sender == "Chase") {
      var sentences = askParserToParseBody_(message.getBody(), "Do not reply to this Alert.");
      row = processWhenAccountIsChase_(message, sentences, row);
    }
    
    rows.push([row["year"], row["month"], row["day"], row["dayOfWeek"], row["date"], row["time"], row["amount"], row["merchant"], "", "", sender, row["last4"], "", "", row["body"]]);
  }
  
  return rows;
}

function defineSender_(message) {
  var mailFrom = message.getFrom();
  if (mailFrom.indexOf("discover") > -1) {
    mailFrom = "Discover";
  } else if (mailFrom.indexOf("citi") > -1) {
    mailFrom = "CitiDoubleCash";
  } else if (mailFrom.indexOf("antriksh") > -1) {
    mailFrom = "Chase";
  }
  return mailFrom;
}

function askParserToParseBody_(body, stoppingPhrase) {
  var bodyHtml = replaceUselessTags_(body);
  body = parseHtml_(bodyHtml);
  body = getTextList_(body, stoppingPhrase);
  body = sentenceTokenizer_(body);

  return body;
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





