const sfmc = require('../sfmc/index');
const auth = require('../auth');

// All in one example
sfmc.dataExtentions.list({
  oauthToken: auth.oauthToken,
  server: 's10',
}, (err, data) => {
  console.log(data);
});
