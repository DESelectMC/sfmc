const expect = require('chai').expect;
const config = require('../config');
const sfmc = require('../sfmc/index');

// Tests will return data that needs to be used in other tests
let queryActivityObjectId = '';

// use Mocha to describe tests and expect certain results
// always follow the pattern ARRANGE ACT ASSERT

describe('queryActivity', () => {
  describe('create()', () => {
    it('should return an object with an ObjectID', () => {
      // ARRANGE
      const authConfig = {
        oauthToken: config.accessToken,
        server: config.server,
      }
  
      const settings = {
        name: `Test-${new Date().getTime()}`,
        // stuff below should be populated dynamically later after retrieving a list of DEs or creating a DE first
        query: 'SELECT * FROM "Deselect-test"',
        DECustomerKey: '5C6DA44B-9ADC-4B0F-8343-17E047DDA782',
        DEName: 'Deselect-test-target',
      }
  
      // ACT
      sfmc.queryActivity.create(authConfig, settings, (err, result) => {
        // ASSERT
        expect(result).to.be.an('object');
        expect(result.ObjectID).to.not.be.empty;
  
        queryActivityObjectId = result.ObjectID;
        console.log({ queryActivityObjectId });
      });
    });
  })

  describe('run()', () => {
    it('should run', () => {
      // TO DO
    });
  })
});
