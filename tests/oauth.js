const expect = require('chai').expect;
const config = require('../config');
const sfmc = require('../sfmc');

console.log({ config });

sfmc.soap.oauth(config, (err, result, body) => {
  console.log({err, result, body});
});

// ZcyovBTeVGe07Pd0e3tKrYdc

describe('oauth()', () => {
  it('should return an accessToken', () => {
    
  });
});
