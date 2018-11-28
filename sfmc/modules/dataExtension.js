const soap = require('../soap');
const Util = require('./util.js');

const search = (authConfig, input, next) => {
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
    fieldsString += `<Properties>${Util.escapeXML(input.fields[i])}</Properties>`;
  }

  soap.execute(authConfig, 'Retrieve', `<soapenv:Body>
     <RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
        <RetrieveRequest>
           <ObjectType>DataExtensionObject[${input.extensionId}]</ObjectType>
           ${fieldsString}
           <Filter xsi:type="SimpleFilterPart">
              <Property>${Util.escapeXML(input.field)}</Property>
              <SimpleOperator>${Util.escapeXML(input.operator)}</SimpleOperator>
              <Value>${Util.escapeXML(input.value)}</Value>
           </Filter>
        </RetrieveRequest>
     </RetrieveRequestMsg>
  </soapenv:Body>`, next);
};


const info = (authConfig, customerKey, next) => {
  soap.execute(authConfig, 'Retrieve', `
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
</soapenv:Body>`, (err, data) => {
  console.log('result get info SMFC' + JSON.stringify(data));
  if (err) console.log(err);
  // Thanks to Jonathan Van Driessen who reported this "bug".
  // If only 1 field is returned, SFMC returns it as an Object instead of Array.
  // Therefore we "normalise" this and returns it as an array.
  // console.log(data);
  if (data && data.OverallStatus) {
    if (data.Results) {
      if (data.OverallStatus === 'Error') {
        next(data.Results.StatusMessage, false);
      } else {
        data.Results = (Array.isArray(data.Results) ? data.Results : [data.Results]);
        next(false, data);
      }
    } else {
      console.log(data);
      next('dataExtension does not exists.', false);
    }
  } else {
    next('No return from SFMC during getInfo.', false);
  }
});
};


const isNumber = (input, standard) => {
  if (!isNaN(input)) {
    return Number(input);
  }
  return standard;
};


const data = (authConfig, input, next) => {
  const defaultLimit = 20;
  info(authConfig, input.extensionId, (err, data) => {
    if (err) console.log(err);
    if (data && data.Results) {
      let fieldsString = '';
      for (let i = 0; i < data.Results.length; i += 1) {
        fieldsString += `<Properties>${Util.escapeXML(data.Results[i].Name)}</Properties>`;
      }

      soap.execute(authConfig, 'Retrieve', `<soapenv:Body>
         <RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
            <RetrieveRequest>
               <ObjectType>DataExtensionObject[${input.extensionId}]</ObjectType>
               ${fieldsString}
            </RetrieveRequest>
         </RetrieveRequestMsg>
      </soapenv:Body>`, (err, data) => {
          console.log('result get data SMFC' + JSON.stringify(data));
        // console.log(data);
        if (data && data.Results && data.OverallStatus) {
          if (data.OverallStatus === 'Error') {
            next(data.Results.StatusMessage, false);
          } else {
            const result = [];
            for (let i = 0; i < data.Results.length; i += 1) {
              // console.log(data.Results[i].Properties.Property);
              const res = {};

              // because sometimes this is an object and something an array (more than 1 item)
              const property = data.Results[i].Properties.Property;
              const Properties = (Array.isArray(property) ? property : [property]);

              for (let x = 0; x < Properties.length; x += 1) {
                // console.log(data.Results[i].Properties.Property[x]);
                const row = Properties[x];
                const name = row.Name;
                res[name] = row.Value;
              }
              result.push(res);
            }

            const limit = input.limit || defaultLimit;

            next(false, result.slice(0, isNumber(limit, defaultLimit)));
          }
        } else {
          next('No return from SFMC during getData.', false);
        }
      });
    } else {
      console.log(data);
      console.log('[Error] No results in returning object.');
      next("Couldn't get data from dataExtension", false);
    }
  });
};


/*
sfmc.modules.dataExtensions.list(auth, (err, data) => {
  console.log(data);
});
*/

const list = (authConfig, next) => {
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
    </soapenv:Body>`, next);
};


// TODO => add fields here
const create = (authConfig, input, next) => {
  /*
  sfmc.dataExtensions.create(auth, {
    name: 'created_by_timothy',
    customerKey: 'xxxxxx',
  }, (err, data) => {
    console.log(data);
  });
  */


  /*
  <Field>
      <CustomerKey>EmailAddress_Key</CustomerKey>
      <Name>EmailAddress</Name>
      <FieldType>EmailAddress</FieldType>
  </Field>


{
  PartnerKey: '',
  Name: 'email',
  Scale: 0,
  DefaultValue: '',
  MaxLength: 254,
  IsRequired: false,
  Ordinal: 4,
  IsPrimaryKey: false,
  FieldType: 'EmailAddress',
}

  */

  let fields = '';
  for (let i = 0; i < input.fields.length; i += 1) {
    let field = '<Field>';
    for (let z = 0; z < Object.keys(input.fields[i]).length; z += 1) {
      const key = Object.keys(input.fields[i])[z];
      const value = input.fields[i][key];

      // TODO: check that this is the minimal requirement.
      /*
      if (key === 'Name') {
        field += `<CustomerKey>${value}</CustomerKey>`;
      }
      */

      // console.log(key, value);
      field += `<${key}>${value}</${key}>`;
    }
    field += '</Field>';
    fields += field;
  }


  // console.log(fields);

  /*
  <IsSendable>false</IsSendable>
  <SendableDataExtensionField>
      <CustomerKey>EmailAddress_Key</CustomerKey>
      <Name>EmailAddress</Name>
      <FieldType>EmailAddress</FieldType>
  </SendableDataExtensionField>
  <SendableSubscriberField>
      <Name>Email Address</Name>
      <Value></Value>
  </SendableSubscriberField>


  */

  soap.execute(authConfig, 'Create', `<soapenv:Body>
 <CreateRequest xmlns="http://exacttarget.com/wsdl/partnerAPI">
     <Options></Options>
        <Objects xmlns:ns1="http://exacttarget.com/wsdl/partnerAPI" xsi:type="ns1:DataExtension">
            <CustomerKey>${Util.escapeXML(input.customerKey || input.name)}</CustomerKey>
            <Name>${input.name}</Name>
            <Fields>
            ${fields}
            </Fields>
        </Objects>
    </CreateRequest>
</soapenv:Body>`, (err, data) => {
  if (data && data.Results && data.OverallStatus) {
    if (data.OverallStatus === 'Error') {
      next(data.Results.StatusMessage, false);
    } else {
      next(false, data);
    }
  } else {
    next('No return from SFMC.', false);
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
