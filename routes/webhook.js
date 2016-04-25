var express = require('express');
var request = require('request');
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
            //sendTextMessage(sender, "Text received, echo: "+ text.substring(0, 200));
            sendGenericMessage(sender);
        }
        if (event.postback) {
            if(event.postback.payload == "recordar"){
                sendTextMessage(sender, "Bien, te recordaré cuando halla un video nuevo");    
            }
            //text = JSON.stringify(event.postback);
            //sendTextMessage(sender, event.postback.payload);
            continue;
        }
    }
    res.sendStatus(200);
});

function sendGenericMessage(sender) {
  messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "First card",
          "subtitle": "Element #1 of an hscroll",
          "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
          "buttons": [{
            "type": "web_url",
            "url": "https://www.messenger.com/",
            "title": "Web url"
          }, {
            "type": "postback",
            "title": "Recordar",
            "payload": "recordar",
          }],
        },{
          "title": "Second card",
          "subtitle": "Element #2 of an hscroll",
          "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
          "buttons": [{
            "type": "postback",
            "title": "Postback",
            "payload": "Payload for second element in a generic bubble",
          }],
        }]
      }
    }
  };
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
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


function sendTextMessage(sender, text) {
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
