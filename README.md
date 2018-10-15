# Salesforce Marketing Cloud NodeJS API
This is a simple NPM package for Salesforce Marketing Cloud.
This project is currently in development mode. Feel free to contribute.

Keep in mind that this package is still under construction.
If you want add extra feature or have feature requests, you can contact us at contact@deselect.io.


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
- In app token managment (request, refresh etc.)
- If token is expired, refresh it


## Author
Timothy Verhaeghe timothy.verhaeghe@deselect.io <br />
Sponsored & maintained by DESelect.io.
