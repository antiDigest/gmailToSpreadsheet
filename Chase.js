// Chase

function processWhenAccountIsChase_(message, sentences, row) {
  row["merchant"] = ""
  for (var i=0; i<sentences.length; i++) {
    if (sentences[i].indexOf("authorized on") > -1) {
      var sentence = sentences[i].split(" has been ")[0];
      row["merchant"] = sentence.split(" at ")[1];
      sentence = sentence.split(" at ")[0]; 
      row["amount"] = sentence.split("$USD) ")[1];
    } else if (sentences[i].indexOf("card account ending in ") > -1) {
      var last4 = sentences[i].split(" ");
      last4 = last4[last4.length-1];
      row["last4"] = last4.split(".")[0];
    }
  }
  row = transactionDateFromEmailMessage_(message.getDate(), row);
  
  row["body"] = sentences.join(" :: ");

  Logger.log(row);

  return row;
}