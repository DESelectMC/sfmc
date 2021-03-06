# Salesforce Marketing Cloud NodeJS API
This is a simple NPM package for Salesforce Marketing Cloud.
This project is currently in development mode. Feel free to contribute.

Keep in mind that this package is still under construction.
If you want add extra feature or have feature requests, you can contact us at contact@deselect.io.

See the UPDATES.md file for updates & versioning.


## Setup
Run `npm install sfmc --save` or simply `yarn add sfmc`



## Examples snippets
See `./samples`.


## Tests
Tests are written using Mocha and Chai.
Note that by testing you are interacting with the SFMC API and hence you will be creating data in the environment you chose to connect to!

Run `npm test tests` to run tests.

Note: To run most tests you will need to do some config:
1. Add your SFMC clientID and clientSecret in `./config` as such:
```
// In ./config/index.js
const config = {
  clientId: '<Your clientId>',
  clientSecret: '<Your clientSecret>',
  accessToken: '', // see below
  server: '<Your SFMC Server Instance>', // e.g. s10
};
```
2. Run `node utils` to get your accessToken. Add it to `./config/index.js` as well.

For more information on how to create an app in SFMC and retrieve your clientId and clientSecret, please refer to the [Salesforce documentation](https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-app-development.meta/mc-app-development/create-a-mc-app.htm).


## Roadmap
- Expand methods for Data Extensions
- Expand methods for Query Activities
- Methods for folders
- Methods for user information
- Methods for Automations
- More test coverage


## Author
Maintained by: DESelect.io (contact@deselect.io) <br />
Initial contributor: Timothy Verhaeghe
