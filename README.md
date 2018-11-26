# Salesforce Marketing Cloud NodeJS API
This is a simple NPM package for Salesforce Marketing Cloud.
This project is currently in development mode. Feel free to contribute.

Keep in mind that this package is still under construction.
If you want add extra feature or have feature requests, you can contact us at contact@deselect.io.

See the UPDATES.md file for updates & versioning.


## Setup
1. `npm install sfmc --save` or simply `yarn add sfmc`
2. If you want to run tests, you will need to add your SFMC clientID and clientSecret in `./config` as such:
```
// In ./config/index.js
const config = {
  clientId: '<Your clientId>',
  clientSecret: '<Your clientSecret>',
};
```
For more information on how to create an app in SFMC and retrieve your clientId and clientSecret, please refer to the [Salesforce documentation](https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-app-development.meta/mc-app-development/create-a-mc-app.htm).


## Examples snippets
See `./samples`.


## Roadmap
- Expand methods for Data Extensions
- Expand methods for Query Activities
- Methods for folders
- Methods for user information
- Methods for Automations


## Author
Maintained by: DESelect.io (contact@deselect.io) <br />
Initial contributor: Timothy Verhaeghe
