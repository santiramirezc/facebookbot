var express = require('express');
var router = express.Router();

var token = "CAAOkHhWLZBL0BAL4NcsGntcBul2S1w0ZBj5u9sNJ7JQoX8ZB18STaw66E4zSHL3R6vbAoWPXqxapuQjQ6Yni2ZAulupxrLpSZA5dbDVGh6hNuXfqcMneZBing1HvmWCmmOxOewaDWPJ98siMVlgDj8xVoLlXZB1tpDqHzUzD5GVOfPXFkbSkMVjNo67moPrTZCwZD";

router.get('/', function(req, res, next) {
  if (req.query['hub.verify_token'] === '<validation_token>') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

router.post('/', function (req, res) {
  console.log("Llego un mensaje al webhook")
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      console.log("El mensaje es : " + text.substring(0, 200) + "El que lo envia es:" + sender);
      sendTextMessage(sender, "Text received, echo: "+ text.substring(0, 200));
    }
  }
  res.sendStatus(200);
});


function sendTextMessage(sender, text) {
    console.log("Intentando enviar mensaje");
  messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:"CAAOkHhWLZBL0BAL4NcsGntcBul2S1w0ZBj5u9sNJ7JQoX8ZB18STaw66E4zSHL3R6vbAoWPXqxapuQjQ6Yni2ZAulupxrLpSZA5dbDVGh6hNuXfqcMneZBing1HvmWCmmOxOewaDWPJ98siMVlgDj8xVoLlXZB1tpDqHzUzD5GVOfPXFkbSkMVjNo67moPrTZCwZD"},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

module.exports = router;
