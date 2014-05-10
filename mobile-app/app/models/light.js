var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema
  , utils = require('../../lib/utils')

var LightSchema = new Schema({
  location: { type: [], index: '2dsphere', sparse: true },
  status: String,
  createdAt: { type : Date, default : Date.now }
})

LightSchema.pre('save', function(next) {
  var value = this.get('location');

  if (value === null) return next();
  if (value === undefined) return next();
  if (!Array.isArray(value)) return next(new Error('Coordinates must be an array'));
  if (value.length === 0) return this.set(path, undefined);
  if (value.length !== 2) return next(new Error('Coordinates should be of length 2'))

  // convert to float -- HACK :/
  this.location = [parseFloat(value[0]), parseFloat(value[1])];

  next();
});

LightSchema.statics = {
  list: function (options, cb) {
    var criteria = options.criteria || {}

    this.find(criteria)
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }
}

LightSchema.path('location').required(true, 'Must provide location');
LightSchema.path('status').required(true, 'Must provide works condition');

mongoose.model('Light', LightSchema)
