const sfmc = require('../sfmc/index');
const auth = require('../auth');

// Data contains ObjectID, which you then can use for updates, or to start it.

// Data from endpoints:
const body = {
  query: 'Select Name as EMAIL from Accounts',
  DEName: 'TEST_QUERY',
  DECustomerKey: 'xxxxx-xxx-xxxx-xxxx-xxxxxxx',
};


// All in one example
sfmc.modules.queryActivity.create({
  oauthToken: auth.oauthToken,
  server: 's10',
}, {
  query: body.query,
  DEName: body.DEName,
  DECustomerKey: body.DECustomerKey,
}, (err, data) => {
  if (data.success) {
    sfmc.modules.queryActivity.run({
      oauthToken: auth.oauthToken,
      server: 's10',
    }, data.ObjectID, (err, task) => {
      console.log('Task', task);
      sfmc.modules.queryActivity.status({
        oauthToken: auth.oauthToken,
        server: 's10',
      }, task.ID, (err, data) => {
        console.log(data);
        if (typeof data.CompletedDate !== 'undefined') {
          console.log({
            success: true,
            done: false,
            message: 'queryActivity pushed and executed.',
          });
        } else {
          console.log({
            success: true,
            done: false,
            message: 'queryActivity pushed and started. But still in progress.',
          });
        }
      });
    });
  } else {
    console.log({
      success: false,
      done: false,
      message: "Couldn't create queryActivity. Problem should be in query or in DE.",
    });
  }
});
