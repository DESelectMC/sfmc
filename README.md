# Salesforce Marketing Cloud NodeJS API
This is a simple NPM package for Salesforce Marketing Cloud.
This project is currently in development mode. Feel free to contribute.

Keep in mind that this package is still under construction.
If you want add extra feature or have feature requests, you can contact me at me@timothyverhaeghe.com


## Installation
```bash
npm install sfmc --save
```

## Examples snippets
```javascript
// Show a list of all dataExtentions
const sfmc = require('sfmc');

sfmc.dataExtentions.list({
  oauthToken: 'xxxxx',
  server: 'xx' // ex. s10
}, (err, data) => {
  console.log(data);
});
```


## Roadmap
- If token is expired, refresh it
- Which server is used


## Author
Timothy Verhaeghe <me@timothyverhaeghe.com>
Sponsored & maintained by DESelect.io.
