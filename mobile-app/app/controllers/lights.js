var mongoose = require('mongoose')
  , Light = mongoose.model('Light')
  , utils = require('../../lib/utils')
  , extend = require('util')._extend

exports.load = function(req, res, next, id){
  Light.findOne(id, function (err, light) {
    if (err) return next(err)
    if (!light) return next(new Error('not found'))
    req.light = light
    next()
  })
}

exports.index = function(req, res){
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1
  var perPage = req.param('perPage')
  var options = {
    perPage: perPage,
    page: page,
    criteria: req.param('criteria') || {}
  }

  Light.list(options, function(err, lights) {
    if (err) return res.render('500')
    Light.count().exec(function (err, count) {
      res.json({
        lights: lights,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      })
    })
  })
}

exports.create = function (req, res) {
  var light = new Light(req.body)

  light.save(function (err) {
    res.json({
      light: light,
      errors: err
    })
  })
}
