const request = require('request');
const xml = require('./xml');
const beautify = require('js-beautify').html;


// TODO: make the webserver endpoint dynamic
const call = (SOAPAction, body, server, next) => {
  request({
    method: 'POST',
    url: `https://webservice.${server}.exacttarget.com/Service.asmx`,
    headers: {
      SOAPAction,
      'Content-Type': 'text/xml',
    },
    body,
  }, (err, response, body) => {
    if (err) console.log(err);
    // console.log(response.statusCode);
    next(err, body);
  });
};


const header = (authConfig) => {
  if (authConfig && typeof authConfig.oauthToken !== 'undefined') {
    return `
    <soapenv:Header>
      <fueloauth>${authConfig.oauthToken}</fueloauth>
    </soapenv:Header>`;
  } if (typeof authConfig.username !== 'undefined' && typeof authConfig.password !== 'undefined') {
    return `
      <soapenv:Header>
         <wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" soapenv:mustUnderstand="1">
            <wsse:UsernameToken xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" wsu:Id="UsernameToken-24440876">
               <wsse:Username>${authConfig.username}</wsse:Username>
               <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">${authConfig.password}</wsse:Password>
            </wsse:UsernameToken>
         </wsse:Security>
      </soapenv:Header>`;
  }
  console.log('[SFMC Module Error] Unable to authentificate.');
  return '';
};


const buildBody = (authConfig, body) => beautify(`
      <?xml version="1.0" encoding="UTF-8"?>
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
      ${header(authConfig)}
      ${body}
      </soapenv:Envelope>
      `.toString(), { indent_size: 2, space_in_empty_paren: true });


const execute = (config, soapType, body, next) => {
  call(soapType, buildBody(config, body), config.server, (err, data) => {
    if (err) console.log(err);
    next(err, xml.parse(data));
  });
};


// Do not request a new access token for every API call
// you make—-each access token is good for an hour and is reusable.
// Making two API calls for every one operation is inefficient and causes throttling.
const oauth = (settings, next) => {
  console.log('requesting new token with clientId:' + settings.clientId + ' and clientSecret:' + settings.clientSecret);
  request({
    method: 'POST',
    url: 'https://auth.exacttargetapis.com/v1/requestToken',
    json: {
      clientId: settings.clientId,
      clientSecret: settings.clientSecret,
    },
  }, (err, response, body) => {
    if (err) console.log(err);
    next(err, body);
  });
};


module.exports = {
  execute,
  oauth,
};
