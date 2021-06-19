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
    // Logger.log("Now extracting more info from: " + message.getSubject());
    var subject = message.getSubject();
    var mailFrom = message.getFrom();
    if (mailFrom.indexOf("Snacks") > -1) {
      break;
    }
    
    var body = message.getBody();
    var bodyHtml = replaceUselessTags_(body);
    body = parseHtml_(bodyHtml);
    body = getTextList_(body);
    body = sentenceTokenizer_(body);

    var merchant = "";
    for (var i=0; i<body.length; i++) {
      if (body[i].indexOf("Merchant") > -1) {
        merchant = merchant + body[i].split("Merchant: ")[1];
        if (merchant == "undefined" || merchant == null) {
          merchant = body[i+2];
        } else if (merchant.trim() == "" || isNumeric(merchant.trim().substring(0, 2))) {
          merchant = merchant + " " + body[i+2];
        }
      }
      else if (body[i].indexOf("Transaction Date") > -1) {
        var transactionDate = body[i].split("Transaction Date: ")[1];
        var transactionYear = transactionDate.split(" ")[2];
        var transactionDay = transactionDate.split(" ")[1].split(",")[0];
        var transactionMonth = transactionDate.split(" ")[0];
        transactionDate = new Date(transactionYear, getMonthFromString(transactionMonth), transactionDay);
        var dayOfWeek = String(transactionDate).split(" ")[0];
      }
      if (body[i].indexOf("Last 4 #:") > -1) {
        var last4 = body[i].split("Last 4 #:")[1].split(" ")[0];
      }
    }
    body = body.join(" :: ");

    var amountRegex = new RegExp(/(?:[\£\$\€]{1}[,\d]+.?\d*)/);
    var amount = body.match(amountRegex)[0];

    var messageDate = message.getDate();
    var date = String(messageDate).split(" ");
    var time= date[4];
    
    rows.push([transactionYear, transactionMonth, transactionDay, dayOfWeek, transactionDate, time, amount, merchant, "", "", "Discover", last4, "", "", body]);
  }
  
  return rows;
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





