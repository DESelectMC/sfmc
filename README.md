# Salesforce Marketing Cloud NodeJS API
This is a simple NPM package for Salesforce Marketing Cloud.
This project is currently in development mode. Feel free to contribute.

Keep in mind that this package is still under construction.
If you want add extra feature or have feature requests, you can contact us at contact@deselect.io.

See the UPDATES.md file for updates & versioning.


## Installation
```bash
npm install sfmc --save
```

## Examples snippets
```javascript
// Show a list of all dataExtensions
const sfmc = require('sfmc');

sfmc.dataExtensions.list({
  oauthToken: 'xxxxx',
  server: 'xx' // ex. s10
}, (err, data) => {
  console.log(data);
});
```


## Roadmap
- Expand methods for Data Extensions
- Expand methods for Query Activities
- Methods for folders
- Methods for user information
- Methods for Automations


## Author
Maintained by: DESelect.io (contact@deselect.io) <br />
Initial contributor: Timothy Verhaeghe
