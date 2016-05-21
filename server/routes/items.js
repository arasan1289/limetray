'use strict';
var express = require('express');
var router = express.Router();
var fs = require('fs');

var r4 = function () {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};
var createId = function () {
  return r4() + r4() + '-' + r4() + '-' + r4() + '-' +
    r4() + '-' + r4() + r4() + r4();
};

router.get('/items', function (req, res) {
  fs.readFile('items.json', 'utf8', function (err, data) {
    if (err) {
      throw err;
    }
    res.send(JSON.parse(data));
  })
});
router.post('/order', function (req, res) {
  fs.readFile('orders.json', 'utf8', function (err, data) {
    if (err) {
      throw err;
    }
    var id = createId(), orders = JSON.parse(data);
    req.body.id = id;
    orders.push(req.body);
    fs.writeFile('orders.json', JSON.stringify(orders), {"encoding": 'utf8'}, function (err) {
      if (err) {
        throw err;
      }
      res.send({orderId: id});
    });
  });
});
module.exports = router;
