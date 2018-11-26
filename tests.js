require('module-alias/register');
const sfmc = require('@sfmc');
const auth = require('@auth');

const xml = require('@sfmc/xml');
const beautify = require('js-beautify').html;


const request = require('request');

// console.log(auth.oauthToken);

/*
sfmc.soap.execute({
  oauthToken: auth.oauthToken,
  server: 's10',
}, 'Retrieve', `
<soapenv:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
<RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
<RetrieveRequest>
  <ObjectType>AccountUser</ObjectType>
  <Properties>Name</Properties>
</RetrieveRequest>
</RetrieveRequestMsg>
</soapenv:Body>`, (err, data) => {
  console.log(data);
});
*/

// https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-apis.meta/mc-apis/account.htm


/*
<soapenv:Body>
   <RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
      <RetrieveRequest>
         <ObjectType>Account</ObjectType>
         <Properties>CustomerKey</Properties>
         <Properties>Email</Properties>
         <Properties>Name</Properties>
         <Properties>Address</Properties>
         <Properties>BrandID</Properties>
         <Properties>BusinessName</Properties>
         <Properties>City</Properties>
         <Properties>Name</Properties>
         <Properties>Country</Properties>
         <Properties>CreatedDate</Properties>
         <Properties>FromName</Properties>
         <Properties>ModifiedDate</Properties>
         <Properties>Phone</Properties>
         <Properties>AccountType</Properties>
      </RetrieveRequest>
   </RetrieveRequestMsg>
</soapenv:Body>
*/

const oauthToken = 'ZUi6xhKfsZ22r8PKP1TJDMMO';

sfmc.queryActivity.create({
  oauthToken,
  server: 's10',
}, {
  DECustomerKey: 'F2827836-28EE-405F-920F-B29A349A557E',
  DEName: 'Target_DE_preview1542104011864',
  name: 'nieuwe_queryActivity4',
  query: 'SELECT Accounts.Name AS name, Accounts.Active AS active FROM Contacts Contacts INNER JOIN Accounts Accounts ON Contacts.account=Accounts.id',
}, (err, data) => {
  if (err) console.log(err);

  console.log('QueryActivityId: ', data.ObjectID);

  sfmc.queryActivity.run({
    oauthToken,
    server: 's10',
  }, data.ObjectID, (err, data) => {
    if (err) console.log(err);
    console.log('TaskId: ', data.ID);
    sfmc.queryActivity.status({
      oauthToken,
      server: 's10',
    }, data.ID, (err, res) => {
      if (err) console.log(err);
      console.log('_______');
      console.log(res);

      setInterval(() => {
        sfmc.queryActivity.status({
          oauthToken,
          server: 's10',
        }, data.ID, (err, res) => {
          if (err) console.log(err);
          console.log('_______');
          console.log(res);
        });
      }, 1000);
    });
  });
});


/*

sfmc.queryActivity.create({
  oauthToken: 'ZUi6xhKfsZ22r8PKP1TJDMMO',
  server: 's10',
}, {
  DECustomerKey: 'Accounts-preview1542124531694',
  DEName: 'Accounts-preview1542124531694',
  name: 'nieuwe_queryActivity',
  query: 'SELECT Accounts.Name AS name, Accounts.Active AS active FROM Contacts Contacts INNER JOIN Accounts Accounts ON Contacts.account=Accounts.id',
}, (err, data) => {
  if (err) console.log(err);
  console.log(data);
});

// SELECT "Accounts"."id" AS "id" FROM "Accounts" "Accounts"


/*
sfmc.dataExtensions.info({
  oauthToken: 'Z1wPtL3NOIB7XDuc0yQgzg8I',
  server: 's10',
}, '821800C0-3B6F-46F8-861F-5766CE3CD0A3', (err, data) => {
  if (data && data.Results) {
    console.log(data);
  } else {
    console.log('Empty return');
  }
});

/*
sfmc.dataExtensions.data({
  oauthToken: 'ZaxL47BQ42ecXveGkRKyc6n3',
  server: 's10',
}, {
  extentionId: 'BFFC6D80-37FF-448A-9289-C29F94A7D49E',
  limit: false, // default 20
}, (err, data) => {
  if (err) console.log(err);
  console.log(data);
});


sfmc.dataExtentions.create({
  oauthToken: 'Z4OoDGa5gZHVbb1YhExm7AH2',
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
*/

/*

const userId = '100150100';
const BusinessUnitId = '100016414';

const body = beautify(`<?xml version="1.0" encoding="utf-8"?>
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <soapenv:Header>
    <fueloauth>ZRl362uQqQgcmzmCr2iZYlag</fueloauth>
  </soapenv:Header>
    <soapenv:Body xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
      <RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
         <RetrieveRequest>
            <ClientIDs>
               <ClientID>${BusinessUnitId}</ClientID>
               <ID>${BusinessUnitId}</ID>
            </ClientIDs>
            <ObjectType>AccountUser</ObjectType>
            <Properties>ID</Properties>
            <Properties>CreatedDate</Properties>
            <Properties>ModifiedDate</Properties>
            <Properties>Client.ID</Properties>
            <Properties>AccountUserID</Properties>
            <Properties>UserID</Properties>
            <Properties>Name</Properties>
            <Properties>Email</Properties>
            <Properties>MustChangePassword</Properties>
            <Properties>ActiveFlag</Properties>
            <Properties>ChallengePhrase</Properties>
            <Properties>ChallengeAnswer</Properties>
            <Properties>IsAPIUser</Properties>
            <Properties>NotificationEmailAddress</Properties>
            <Properties>Client.PartnerClientKey</Properties>
            <Properties>Password</Properties>
            <Properties>Locale.LocaleCode</Properties>
            <Properties>TimeZone.ID</Properties>
            <Properties>TimeZone.Name</Properties>
            <Properties>CustomerKey</Properties>
            <Properties>DefaultBusinessUnit</Properties>
            <Properties>LanguageLocale.LocaleCode</Properties>
            <Properties>Client.ModifiedBy</Properties>
            <QueryAllAccounts>true</QueryAllAccounts>
         </RetrieveRequest>
      </RetrieveRequestMsg>
   </soapenv:Body>
  </soapenv:Envelope>`.toString(), { indent_size: 2, space_in_empty_paren: true });

request({
  method: 'POST',
  url: 'https://webservice.s10.exacttarget.com/Service.asmx',
  headers: {
    SOAPAction: 'Retrieve',
    'Content-Type': 'text/xml',
  },
  body,
}, (err, response, body) => {
  if (err) console.log(err);
  // console.log(response.statusCode);

  const data = xml.parse(body);
  console.log(data);
  if (typeof data.Results !== 'undefined') {
    console.log('Succeed');
    for (let i = 0; i < data.Results.length; i++) {
      if (data.Results[i].AccountUserID.toString() == userId) {
        console.log('************$');
        console.log(data.Results[i]);
        break;
      }
    }
  } else {
    console.log('FAILED');
  }
});

*/