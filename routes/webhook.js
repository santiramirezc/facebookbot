var express = require('express');
var request = require('request');
var router = express.Router();

var token = "EAAOkHhWLZBL0BAPXc283VRMQdJ2EZB9T7qLjLdEzmAZCOOvCh3ZBVNLk60UbYggp3ESWNzie6M04clzzVZAcTSKHsr4SsB4GtCZAZCeHZCWWCIo3iuvWdrZBmiGrICVt1PzCuaoCnC3QlbE1pYFhx0lx34Qc86BVmgiuOxRvStHoBowZDZD";

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
            text = text.toLowerCase();
            
            if(text == "hola" | text == "ola" ){
                sendTextMessage(sender, "Hola");
            }
            if(text == "hi" ){
                sendTextMessage(sender, "Hi there. Look at this bikes:");
                sendGenericMessageBike(sender);
            }
            if(text == "bye" ){
                sendTextMessage(sender, "Bye, hope to chat soon.");
            }
            else{
                //sendGenericMessage(sender);
            }
        }
        if (event.postback) {
            if(event.postback.payload == "recordar"){
                sendTextMessage(sender, "You are making one of the best choices of your life, tell me where to send it.");    
            }
            //text = JSON.stringify(event.postback);
            //sendTextMessage(sender, event.postback.payload);
            continue;
        }
    }
    res.sendStatus(200);
});

function sendGenericMessageBike(sender){
  messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "Super Fast Bike",
          "subtitle": "With this bike you will fly",
          "image_url": "https://static.pexels.com/photos/59904/pexels-photo-59904-large.jpeg",
          "buttons": [{
            "type": "web_url",
            "url": "https://www.messenger.com/",
            "title": "Buy this one"
          }, {
            "type": "postback",
            "title": "Another please",
            "payload": "recordar",
          }],
        },{
          "title": "Super Montain Bike",
          "subtitle": "You will get to the top of the Everest with this bike",
          "image_url": "https://static.pexels.com/photos/24846/pexels-photo-24846-large.jpg",
          "buttons": [{
            "type": "web_url",
            "url": "https://www.messenger.com/",
            "title": "Buy this one"
          }, {
            "type": "postback",
            "title": "Another please",
            "payload": "recordar",
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


module.exports = router;
