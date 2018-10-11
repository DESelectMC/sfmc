# Examples
Here are some examples:

## authentification
```javascript
// define your auth
const auth = { username: 'xxxx', password: 'yyyy'} // with username & password
const auth = { oauthToken: 'xxxxx'} // or with oauthToken (=> ADVICED)
```


```javascript
// Module to create a new queryActivity
sfmc.queryActivity.create(auth, {
  query: 'Select Name as EMAIL from Accounts',
  DEName: 'Target_DE',
  DECustomerKey: 'xxxxx-xxxx-xxxx-xxx-xxxx',
}, (err, data) => {
  console.log(JSON.stringify(data));
});
```

```javascript
// Module to update a queryActivity
sfmc.queryActivity.update(auth, 'xxxxx-xxx-xxx-xxx-xxx', {
  name: 'Test activity',
  description: 'Test activity',
  query: 'Select Name as EMAIL from Accounts',
  extentionId: 'xxxx-xxxx-xxxx-xxx-xxxxx',
  extentionName: 'Target_DE',
}, (err, data) => {
  console.log(data);
});
```

```javascript
// Module to start a queryActivity & to check the status
sfmc.queryActivity.run(auth, 'xxxx-xxx-4139-xxx-xxxx', (err, task) => {
  console.log('Task', task);
  sfmc.queryActivity.status(auth, task.ID, (err, data) => {
    console.log(data);
    setTimeout(() => {
      sfmc.queryActivity.status(auth, task.ID, (err, data) => {
        console.log(data);
      });
    }, 3000);
  });
});
```
