// GENERATE AN OAUTH TOKEN

const sfmc = require('../sfmc/index');

// credentials, you can find them in the account > installed packages > package name.
const config = {
  clientId: 'xxxx',
  clientSecret: 'xxx',
};

// All in one example
sfmc.soap.oauth(config, (error, success, data) => {
  console.log(data);
});
