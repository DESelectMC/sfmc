const request = require('request');
const xml = require('./xml');
const beautify = require('js-beautify').html;


// TODO: make the webserver endpoint dynamic
const call = (SOAPAction, body, server, cb) => {
  request({
    method: 'POST',
    url: `https://webservice.${server}.exacttarget.com/Service.asmx`,
    headers: {
      SOAPAction,
      'Content-Type': 'text/xml',
    },
    body,
  }, (error, response, body) => {
    if (error && typeof cb === 'function') {
      console.log(error);
      cb(error, null);
    } else if (typeof cb === 'function') {
      cb(null, body);
    }
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


/* Returns cb(error, success, data) */
const execute = (config, soapType, body, cb) => {
  call(soapType, buildBody(config, body), config.server, (error, data) => {
    if (error && typeof cb === 'function') {
      cb(error, false, null);
    } else if (typeof cb === 'function') {
      cb(null, true, xml.parse(data));
    }
  });
};


// Do not request a new access token for every API call
// you make—-each access token is good for an hour and is reusable.
// Making two API calls for every one operation is inefficient and causes throttling.
const oauth = (settings, cb) => {
  console.log('requesting new token with clientId:' + settings.clientId + ' and clientSecret:' + settings.clientSecret);
  request({
    method: 'POST',
    url: 'https://auth.exacttargetapis.com/v1/requestToken',
    json: {
      clientId: settings.clientId,
      clientSecret: settings.clientSecret,
    },
  }, (error, response, body) => {
    if (typeof cb === 'function') {
      cb(error, !(error), body);
    }
  });
};


module.exports = {
  execute,
  oauth,
};
