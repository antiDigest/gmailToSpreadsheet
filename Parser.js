function parseGmailMessageBody_(body) {
  body = parseHtml_(body);
  body = getTextList_(body);
  body = sentenceTokenizer_(body);

  var sentenceToParse = null;
  for (var i=0; i<body.length; i++) {
    if (body[i].indexOf("share") > -1) {
      sentenceToParse = body[i];
    } else if (body[i].indexOf("$") > -1) {
      sentenceToParse = body[i];
    }
  }

  return body.join(" :: "), sentenceToParse;
}

function parseHtml_(html) {
  html = replaceUselessTags_(html);
  var doc = XmlService.parse(html);
  return doc;
}

function replaceUselessTags_(body) {
  var regex = new RegExp('<!--.*-->', 'gm');
  var formattedBody = body.replace(regex,"");
  var bodyRegex = new RegExp(/<body[\s\S]*<\/body>/gi);
  var bodyHtml = formattedBody;//.match(bodyRegex)[0];

  var imgRegex = new RegExp(/<img([\s\S]*?)>/gi);
  bodyHtml = bodyHtml.replace(imgRegex, "");
  var brRegex = new RegExp(/<br([\s\S]*?)>/gi);
  bodyHtml = bodyHtml.replace(brRegex, "");

  bodyHtml = bodyHtml.replace(/&/g, "&amp;");
  // Logger.log(bodyHtml);

  return bodyHtml;
}

function getTextList_(element) {  
  var data = [];
  var descendants = element.getDescendants();
  descendants.push(element);  
  for(i in descendants) {
    // Logger.log(descendants);
    try {
      var elt = descendants[i].asElement();
      var elementText = elt.getText();
      if (elementText != null && elementText != "") {
        elementText = elementText.trim();
        if (elementText != "") {
          // Logger.log(elementText);
          data.push(elementText);
        }
        if (elementText.indexOf("1-800-DISCOVER") > -1) {
          return data;
        }
      }
    } catch (TypeError) {
      continue;
    }
  }
  return data;
}

function sentenceTokenizer_(paras) {

  // Logger.log(paras);

  var sentences = [];
  var sentenceRegex = new RegExp(/\n/);
  var para = paras.join("\n");
  // Logger.log(para)
  var interSentences = para.split(sentenceRegex);
  if (interSentences.length <= 0) {
    return "";
  }
  for (var s=0; s<interSentences.length; s++){
    var inter = interSentences[s];
    inter = inter.trim();
    if (inter != ""){
      sentences.push(inter);
    }
  }

  // Logger.log(sentences);
  return sentences;
}
