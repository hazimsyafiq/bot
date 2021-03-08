var token = "<bot token>";
var telegramUrl = "https://api.telegram.org/bot" + token;
var webAppUrl = "<web app url>";

function setWebhook() {
  var url = telegramUrl + "/setWebhook?url=" + webAppUrl;
  var response = UrlFetchApp.fetch(url);
}

function sendMessage(id, text, keyBoard) {
  var data = {
    method: "post",
    payload: {
      method: "sendMessage",
      chat_id: String(id),
      text: text,
      parse_mode: "HTML",
      reply_markup: JSON.stringify(keyBoard)
    }
  };
  UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/', data);
}

function fetchTopActive() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("top active");
  var url = "https://www.bursamalaysia.com/market_information/equities_prices?top_stock=top_active&legend%5B%5D=%5BS%5D";
  
  for(var i = 1; i <= 3; i++) {
    //XPath for [0]-stock name [1]-last [2]-%change
    var item = ["//*[@id='data-1']/td[2]/text()", "//*[@id='data-1']/td[5]", "//*[@id='data-1']/td[8]/div"];
    var formula = "=IMPORTXML(" + String.fromCharCode(34) + url + String.fromCharCode(34) + "," + String.fromCharCode(34) + item[i-1] + String.fromCharCode(34) + ")";
    sheet.getRange(2, i).activate();
    sheet.getActiveRangeList().clear({contentsOnly: true, skipFilterdRows: true});
    sheet.getActiveRangeList().setFormula(formula);
  }
}

function fetchTopGainers() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("top gainers");
  var url = "https://www.bursamalaysia.com/market_information/equities_prices?top_stock=top_gainers&legend%5B%5D=%5BS%5D";
  
  for(var i = 1; i <= 3; i++) {
    //XPath for [0]-stock name [1]-last [2]-%change
    var item = ["//*[@id='data-1']/td[2]/text()", "//*[@id='data-1']/td[5]", "//*[@id='data-1']/td[8]/div"];
    var formula = "=IMPORTXML(" + String.fromCharCode(34) + url + String.fromCharCode(34) + "," + String.fromCharCode(34) + item[i-1] + String.fromCharCode(34) + ")";
    sheet.getRange(2, i).activate();
    sheet.getActiveRangeList().clear({contentsOnly: true, skipFilterdRows: true});
    sheet.getActiveRangeList().setFormula(formula);
  }
}

function fetchTopLosers() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("top losers");
  var url = "https://www.bursamalaysia.com/market_information/equities_prices?top_stock=top_losers&legend%5B%5D=%5BS%5D";
  
  for(var i = 1; i <= 3; i++) {
    //XPath for [0]-stock name [1]-last [2]-%change
    var item = ["//*[@id='data-1']/td[2]/text()", "//*[@id='data-1']/td[5]", "//*[@id='data-1']/td[8]/div"];
    var formula = "=IMPORTXML(" + String.fromCharCode(34) + url + String.fromCharCode(34) + "," + String.fromCharCode(34) + item[i-1] + String.fromCharCode(34) + ")";
    sheet.getRange(2, i).activate();
    sheet.getActiveRangeList().clear({contentsOnly: true, skipFilterdRows: true});
    sheet.getActiveRangeList().setFormula(formula);
  }
}

function doPost(e) {
  var contents = JSON.parse(e.postData.contents);
  var ssId = "<spreadsheet id>";
  var ss = SpreadsheetApp.openById(ssId);
  
  if(contents.callback_query) {
    var id = contents.callback_query.from.id;
    var data = contents.callback_query.data;
    // var d = new Date;
    // var date = d.getDate();
    // var month = d.getDate();
    // var hours = d.getDate();
    // var minutes = d.getDate();
    
    if (data == "topActive") {
      //start fetch?
      var sheet = ss.getSheetByName("top active");
      var range = sheet.getDataRange();
      var values = range.getValues();
      var list = "";
      //list out all data in range
      for (var i = 0; i < values.length; i++) {
        for (var j = 0; j < values[i].length; j++) {
          if (values[i][j]) {
            list = list + values[i][j];
          }
          list = list + "              ";
        }
        list = list + "\n";
      }
      return sendMessage(id, "TOP ACTIVE \n" + list);
    } else if (data == "topGainers") {
        var sheet = ss.getSheetByName("top gainers");
        var range = sheet.getDataRange();
        var values = range.getValues();
        var list = "";
        //list out all data in range
        for (var i = 0; i < values.length; i++) {
          for (var j = 0; j < values[i].length; j++) {
            if (values[i][j]) {
              list = list + values[i][j];
            }
            list = list + "              ";
          }
          list = list + "\n";
        }
        return sendMessage(id, "TOP GAINERS \n" + list);
    } else if (data == "topLosers") {
        var sheet = ss.getSheetByName("top losers");
        var range = sheet.getDataRange();
        var values = range.getValues();
        var list = "";
        //list out all data in range
        for (var i = 0; i < values.length; i++) {
          for (var j = 0; j < values[i].length; j++) {
            if (values[i][j]) {
              list = list + values[i][j];
            }
            list = list + "\t\t\t";
          }
          list = list + "\n";
        }
        return sendMessage(id, ```TOP LOSERS \n ${list} ```);
      } 
  } else if (contents.message) {
    var id = contents.message.from.id;
    var text = contents.message.text;
    
    var keyBoard = {
      "inline_keyboard": [
        [{"text": "Top Active", "callback_data": "topActive"}],
        [{"text": "Top Gainers", "callback_data": "topGainers"}],
        [{"text": "Top Losers", "callback_data": "topLosers"}]
      ]
    }
    return sendMessage(id, "Select Screener", keyBoard)
  }
}
