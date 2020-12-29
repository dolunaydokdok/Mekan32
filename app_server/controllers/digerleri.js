var express = require('express');
var router = express.Router();

module.exports.hakkinda = function (req, res, next) {
  res.render('hakkinda', { title: 'Hakkında', 'footer': 'Dolunay Dökdök 2020' });
}



