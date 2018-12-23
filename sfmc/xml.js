// to text XML online, you can use => http://xmlbeautifier.com/
const xmlParser = require('fast-xml-parser');

// Returns false if parsing failed, otherwise returns parsed xml
const parse = (xmlData) => {
  // console.log(xmlData);
  if (xmlData) {
    if (xmlParser.validate(xmlData) === true) { // optional
      const parsed = xmlParser.parse(xmlData);
      const base = parsed['soap:Envelope']['soap:Body'];

      if (typeof base.RetrieveResponseMsg !== 'undefined') {
        return parsed['soap:Envelope']['soap:Body'].RetrieveResponseMsg;
      } else if (typeof base.CreateResponse !== 'undefined') {
        return parsed['soap:Envelope']['soap:Body'].CreateResponse;
      } else if (typeof base.UpdateResponse !== 'undefined') {
        return parsed['soap:Envelope']['soap:Body'].UpdateResponse;
      } else if (typeof base.PerformResponseMsg !== 'undefined') {
        return parsed['soap:Envelope']['soap:Body'].PerformResponseMsg;
      }

      return base;
    }

    console.log('[SFMC Module Error] No valid XML returned.');
    console.log('[SFMC Module LOG]: Returned xml:', xmlData);
    return false; // incorrect format.
  } else {
    console.log('no xmlData to parse');
    return false;
  }
};

const escapeXML = (query) => {
  if (query) {
    query = query.replace(/</g, '&lt;');
  }
  // query = query.replace(/>/g, '&gt'); // escaping this characters returns invalid xml, like when we DONT escape <...
  return query;
};

module.exports = {
  parse,
  escapeXML,
};
