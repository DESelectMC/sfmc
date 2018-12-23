// Code to create & run queryActivity


const oauthToken = '';

sfmc.queryActivity.create({
  oauthToken,
  server: 's10',
}, {
  DECustomerKey: 'testDECustomerKey',
  DEName: 'testDEName',
  name: 'testName',
  query: 'SELECT Accounts.Name AS name, Accounts.Active AS active FROM Contacts Contacts INNER JOIN Accounts Accounts ON Contacts.account=Accounts.id',
}, (error, success, data) => {
  if (error) console.log(error);

  console.log('QueryActivityId: ', data.ObjectID);

  sfmc.queryActivity.run({
    oauthToken,
    server: 's10',
  }, data.ObjectID, (error, success, data) => {
    if (error) console.log(error);
    console.log('TaskId: ', data.ID);
    sfmc.queryActivity.status({
      oauthToken,
      server: 's10',
    }, data.ID, (error, success, res) => {
      if (error) console.log(error);
      console.log('_______');
      console.log(res);

      setInterval(() => {
        sfmc.queryActivity.status({
          oauthToken,
          server: 's10',
        }, data.ID, (error, success, res) => {
          if (error) console.log(error);
          console.log('_______');
          console.log(res);
        });
      }, 1000);
    });
  });
});
