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

function doPost(e) {
  var contents = JSON.parse(e.postData.contents);
  var ssId = "<spreadsheet id>";
  var sheet = SpreadsheetApp.openById(ssId).getSheetByName("RAW");
  
  if(contents.callback_query) {
    var id = contents.callback_query.from.id;
    var data = contents.callback_query.data;
    
    if (data == "expenses") {
      var cashExpenses = sheet.getDataRange().getCell(2, 2).getValue();
      var cardExpenses = sheet.getDataRange().getCell(2, 3).getValue();
      return sendMessage(id, "Your expenses for this month: \n\n Cash: RM" + cashExpenses.toFixed(2) + "\n Card: RM" + cardExpenses.toFixed(2) + "\n Total: RM" + (cashExpenses+cardExpenses).toFixed(2));
    } else if (data == "balance") {
        var cashBal = sheet.getDataRange().getCell(3, 2).getValue();
        var cardBal = sheet.getDataRange().getCell(3, 3).getValue();
        return sendMessage(id, "Your balance left for this month: \n\n Cash: RM" + cashBal.toFixed(2) + "\n Card: RM" + cardBal.toFixed(2) + "\n Total: RM" + (cashBal+cardBal).toFixed(2));
    } 
  } else if(contents.message) {
    var id = contents.message.from.id;
    var text = contents.message.text;
          
    if (text.indexOf("#") !== -1) {
      var dateNow = new Date;
      var reformattedDate = dateNow.getDate();
      var text = contents.message.text;
      var item = text.split("#");
      sheet.appendRow([reformattedDate, item[0], item[1], item[2], item[3]]);
      return sendMessage(id, "Item added to spreadsheet");
    } else {
      var keyBoard = {
        "inline_keyboard": [
          [{"text": "Expenses", "callback_data": "expenses"}],
          [{"text": "Balance", "callback_data": "balance"}]
        ]
      }
      return sendMessage(id, "Send your purchases using this format: \n\n [item] # [category] # [price]  (for cash payment)\n [item] # [category] ## [price] (for card payment) \n\nOr choose request below:", keyBoard)
    }
  }
}
