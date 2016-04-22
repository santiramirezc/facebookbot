var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/webhook', function(req, res, next) {
  if (req.query['hub.verify_token'] === 'CAAOkHhWLZBL0BAD2ViYVXR5PhJrdFatLG306yirHopiQviUZCR0lQUBaJp0XM3U2TR6yo6r6THNVxknl36Vq4dTudQRUtD42ctp5SnoHMSW1kZAg1ZCOevpPnttAY3P0setfx0Nr0sCkjTQuZBP2ZBHPYm358TZBZAyOREcDiPLUFKZAtMhimHpnpMfsHPvo8mSUZD') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

module.exports = router;
