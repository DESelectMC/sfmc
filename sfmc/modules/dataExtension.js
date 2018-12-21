const soap = require('../soap');
const xml = require('../xml.js');
const util = require('../util.js');

/* search for data extensions matching the given criteria */
const search = async (authConfig, input, cb) => {
  /* example call
  sfmc.modules.dataExtensions.search(auth, {
    field: 'leeftijd',
    operator: 'equals',
    value: '23',
    extensionId: 'AEC60599-F25C-4A42-B847-431FFD502648',
    fields: [
      'firstname',
      'lastname',
    ],
  }, (err, data) => {
    console.log(data);
  });


  <soapenv:Body>
     <RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
        <RetrieveRequest>
           <ObjectType>DataExtensionObject[xxxxxxxxxxxxxx]</ObjectType>
           <Properties>firstname</Properties>
           <Properties>lastname</Properties>
           <Filter xsi:type="SimpleFilterPart">
              <Property>firstname</Property>
              <SimpleOperator>equals</SimpleOperator>
              <Value>timothy</Value>
           </Filter>
        </RetrieveRequest>
     </RetrieveRequestMsg>
  </soapenv:Body>
  */

  let fieldsString = '';
  for (let i = 0; i < input.fields.length; i += 1) {
    fieldsString += `<Properties>${xml.escapeXML(input.fields[i])}</Properties>`;
  }

  soap.execute(authConfig, 'Retrieve', `<soapenv:Body>
     <RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
        <RetrieveRequest>
           <ObjectType>DataExtensionObject[${input.extensionId}]</ObjectType>
           ${fieldsString}
           <Filter xsi:type="SimpleFilterPart">
              <Property>${xml.escapeXML(input.field)}</Property>
              <SimpleOperator>${xml.escapeXML(input.operator)}</SimpleOperator>
              <Value>${xml.escapeXML(input.value)}</Value>
           </Filter>
        </RetrieveRequest>
     </RetrieveRequestMsg>
  </soapenv:Body>`, (error, success, data) => {
    if (typeof cb === 'function') {
      if (error) {
        console.log(error);
      }
      cb(error, success, data);
    }
  });
};

/* get the details of a data extension with given customerkey. Returns cb(error, success, data) */
const info = (authConfig, customerKey, cb) => {
  // Only the properties defined here will be returned
  // See https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-apis.meta/mc-apis/dataextensionfield.htm for all available properties
  //         <Properties>DisplayOrder</Properties>

  const xml = `
  <soapenv:Body xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
   <RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
     <RetrieveRequest>
        <ObjectType>DataExtensionField</ObjectType>
        <Properties>Client.ID</Properties>
        <Properties>CreatedDate</Properties>
        <Properties>CustomerKey</Properties>
        <Properties>DataExtension.CustomerKey</Properties>
        <Properties>DefaultValue</Properties>
        <Properties>FieldType</Properties>
        <Properties>IsPrimaryKey</Properties>
        <Properties>IsRequired</Properties>
        <Properties>MaxLength</Properties>
        <Properties>ModifiedDate</Properties>
        <Properties>Name</Properties>
        <Properties>ObjectID</Properties>
        <Properties>Ordinal</Properties>
        <Properties>Scale</Properties>
        <Filter xsi:type="SimpleFilterPart">
           <Property>DataExtension.CustomerKey</Property>
           <SimpleOperator>equals</SimpleOperator>
           <Value>${customerKey}</Value>
        </Filter>
        <QueryAllAccounts>true</QueryAllAccounts>
        <Retrieves />
        <Options>
           <SaveOptions />
           <IncludeObjects>true</IncludeObjects>
        </Options>
     </RetrieveRequest>
   </RetrieveRequestMsg>
  </soapenv:Body>`;
  console.log(xml);
  soap.execute(authConfig, 'Retrieve', xml, (error, success, data) => {
    console.log('result dataExtension info call SMFC' + JSON.stringify(data));
    // Thanks to Jonathan Van Driessen who reported this "bug".
    // If only 1 field is returned, SFMC returns it as an Object instead of Array.
    // Therefore we "normalise" this and returns it as an array.
    // console.log(data);
    if (error && typeof cb === 'function') {
      console.log(error);
      cb(error, false, null);
    } else {
      if (data && data.OverallStatus) {
        if (data.Results) {
          if (data.OverallStatus === 'Error') {
            if (typeof cb === 'function') {
              cb(data.Results.StatusMessage, false, null);
            }
          } else {
            data.Results = (Array.isArray(data.Results) ? data.Results : [data.Results]);
            if (typeof cb === 'function') {
              cb(null, true, data);
            }
          }
        } else {
          if (typeof cb === 'function') {
            cb('DataExtension cannot be found with SFMC', false);
          }
        }
      } else {
        if (typeof cb === 'function') {
          cb('Unknown error from SFMC API', false, null);
        }
      }
    }
  });
};

/* get the data from a data extension. Returns cb(error, success, data) */
const data = (authConfig, input, cb) => {
  const defaultLimit = 20;
  // Get the fields of the extension
  info(authConfig, input.extensionId, (error, success, data) => {
    if (error && typeof cb === 'function') {
      console.log(error);
      cb(error, false, null);
    } else {

      if (data && data.Results) {
        // Create string with all fields we want to retrieve
        let fieldsString = '';
        for (let i = 0; i < data.Results.length; i += 1) {
          fieldsString += `<Properties>${xml.escapeXML(data.Results[i].Name)}</Properties>`;
        }

        // Retrieve data from data extension
        soap.execute(authConfig, 'Retrieve', `<soapenv:Body>
           <RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
              <RetrieveRequest>
                 <ObjectType>DataExtensionObject[${input.extensionId}]</ObjectType>
                 ${fieldsString}
              </RetrieveRequest>
           </RetrieveRequestMsg>
        </soapenv:Body>`, (error, success, data) => {
          console.log('result dataExtension data call SMFC' + JSON.stringify(data));
          if (error && typeof cb === 'function') {
            console.log(error);
            cb(error, false, null);
          } else {
            if (data && data.Results && data.OverallStatus) {
              if (data.OverallStatus === 'Error') {
                if (typeof cb === 'function') {
                  cb(data.Results.StatusMessage, false, null);
                }
              } else {
                const result = [];
                // if there is only 1 result, Results will be an object instead of an array
                const results = (Array.isArray(data.Results) ? data.Results : [data.Results]);
                for (let i = 0; i < results.length; i += 1) {
                  const res = {};

                  // because sometimes this is an object and something an array (more than 1 item)
                  const property = results[i].Properties.Property;
                  const properties = (Array.isArray(property) ? property : [property]);

                  for (let x = 0; x < properties.length; x += 1) {
                    const row = properties[x];
                    const name = row.Name;
                    res[name] = row.Value;
                  }
                  result.push(res);
                }

                const limit = input.limit || defaultLimit;
                if (typeof cb === 'function') {
                  cb(null, true, result.slice(0, util.isNumber(limit, defaultLimit)));
                }
              }
            } else {
              if (typeof cb === 'function') {
                cb('No results from SFMC while getting DataExtension data', false, null);
              }
            }
          }
        });
      } else {
        if (typeof cb === 'function') {
          cb('No results from SFMC while getting DataExtension info', false, null);
        }
      }
    }
  });
};

/* Get all DataExtensions for organisation */
const list = (authConfig, cb) => {
  soap.execute(authConfig, 'Retrieve', `
      <soapenv:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
       <RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
          <RetrieveRequest>
             <ObjectType>DataExtension</ObjectType>
             <Properties>ObjectID</Properties>
             <Properties>CustomerKey</Properties>
             <Properties>Name</Properties>
             <Properties>IsSendable</Properties>
             <Properties>SendableSubscriberField.Name</Properties>
          </RetrieveRequest>
       </RetrieveRequestMsg>
    </soapenv:Body>`, (error, success, data) => {
      if (typeof cb === 'function') {
        if (error) {
          console.log(error);
        }
        cb(error, !(error), data);
      }
    });
};


/* Create new DataExtension. Returns cb(error, success, data) */
const create = (authConfig, input, cb) => {
  // Create string for fields
  let fields = '';
  for (let i = 0; i < input.fields.length; i += 1) {
    let field = '<Field>\n';
    for (let z = 0; z < Object.keys(input.fields[i]).length; z += 1) {
      const key = Object.keys(input.fields[i])[z];
      const value = input.fields[i][key];
      if (value) {
        field += ` <${key}>${value}</${key}>\n`;
      }
    }
    field += '</Field>\n';
    fields += field;
  }

 let xmlString = `<soapenv:Body>
                  <CreateRequest xmlns="http://exacttarget.com/wsdl/partnerAPI">
                      <Options></Options>
                         <Objects xmlns:ns1="http://exacttarget.com/wsdl/partnerAPI" xsi:type="ns1:DataExtension">
                             <CustomerKey>${xml.escapeXML(input.customerKey || input.name)}</CustomerKey>
                             <Name>${input.name}</Name>
                             <Fields>
                             ${fields}
                             </Fields>
                         </Objects>
                     </CreateRequest>
                  </soapenv:Body>`;
  soap.execute(authConfig, 'Create', xmlString, (error, success, data) => {
    if (error && typeof cb === 'function') {
      console.log(error);
      cb(error, false, null);
    } else {
      if (data && data.Results && data.OverallStatus) {
        if (data.OverallStatus === 'Error') {
          if (typeof cb === 'function') {
            cb(data.Results.StatusMessage, false, null);
          }
        } else {
          if (typeof cb === 'function') {
            cb(null, true, data);
          }
        }
      } else {
        if (typeof cb === 'function') {
          cb('No results from SFMC while creating DataExtension', false, null);
        }
      }
    }
  });
};


module.exports = {
  list,
  data,
  info,
  search,
  create,
};
