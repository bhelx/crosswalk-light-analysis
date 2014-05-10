var lights = require('../app/controllers/lights')
  , application = require('../app/controllers/application')
  ;

module.exports = function (app, passport) {

  /** JSON api **/
  app.param('id', lights.load)
  app.get('/lights', lights.index)
  app.post('/lights', lights.create)
  //app.get('/lights/:id', lights.show)
  //app.put('/lights/:id', lights.update)
  //app.del('/lights/:id', lights.destroy)

  /** Application Bootstrap **/
  app.get('/', application.index)

}
