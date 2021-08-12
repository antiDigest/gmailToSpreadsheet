var AMOUNTINDEX = 6;

function processWhenAccountIsText_(sheet, message, sentences, row) {
  Logger.log(sentences)
  var sentence = sentences[1];
  var words = sentence.split(" ");

  var lastRow = getLastRowValues_(sheet);

  if (words[0].toLowerCase() == "add") {
    var additionalCost = parseFloat(words[1]);
    if (words[1].indexOf("%") > -1) {
      additionalCost = (parseFloat(lastRow[AMOUNTINDEX]) * additionalCost)/(100.0);
    }

    lastRow[AMOUNTINDEX] = parseFloat(lastRow[AMOUNTINDEX]) + additionalCost;
    row = lastRow;
    updateLastRowAmount_(sheet, lastRow[AMOUNTINDEX]);
  }

  return row;
}
