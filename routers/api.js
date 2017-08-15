const apiController = require('../controllers').api;

module.exports = router => {
  Object.keys(apiController).forEach(action => {
    router.post('/api/' + action, apiController[action]);
  });
};
