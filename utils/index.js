const config = require('../config');
const sfmc = require('../sfmc');

sfmc.soap.oauth(config, (err, data) => {
  console.log(data);
});