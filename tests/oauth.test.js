const expect = require('chai').expect;
const config = require('../config');
const sfmc = require('../sfmc');

// use Mocha to describe tests and expect certain results
// always follow the pattern ARRANGE ACT ASSERT

describe('oauth()', () => {
  it('should return an object with an accessToken', () => {
    // ARRANGE
    const settings = config;
    // ACT
    sfmc.soap.oauth(settings, (err, result, body) => {
      // ASSERT
      expect(result).to.be.an('object');
      expect(result.accessToken).to.not.be.empty;
    })
  });
});
