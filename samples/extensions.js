const sfmc = require('../sfmc/index');
const auth = require('../auth');

// All in one example
sfmc.dataExtensions.list({
  oauthToken: auth.oauthToken,
  server: 's10',
}, (err, data) => {
  console.log(data);
});


sfmc.dataExtensions.info({
  oauthToken: auth.oauthToken,
  server: 's10',
}, 'BFFC6D80-37FF-448A-9289-C29F94A7D49E', (err, data) => {
  if (data && data.Results) {
    console.log(data);
  } else {
    console.log('Empty return');
  }
});

sfmc.dataExtensions.data({
  oauthToken: auth.oauthToken,
  server: 's10',
}, {
  extensionId: 'BFFC6D80-37FF-448A-9289-C29F94A7D49E',
  limit: false, // default 20
}, (err, data) => {
  if (err) console.log(err);
  console.log(data);
});


sfmc.dataExtensions.create({
  oauthToken: auth.oauthToken,
  server: 's10',
}, {
  name: 'timothy_test2',
  fields: [{
    Name: 'firstName',
    FieldType: 'Text', // can be "EmailAddress", "Text"
  }, {
    PartnerKey: '',
    Name: 'email',
    Scale: 0,
    DefaultValue: '',
    MaxLength: 254,
    IsRequired: false,
    Ordinal: 4,
    IsPrimaryKey: false,
    FieldType: 'EmailAddress',
  }],
}, (err, data) => {
  if (err) console.log(err);
  console.log(data);
});
