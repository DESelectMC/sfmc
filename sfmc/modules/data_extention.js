const soap = require('../soap');


const search = (authConfig, input, next) => {
  /* example call
  sfmc.modules.dataExtentions.search(auth, {
    field: 'leeftijd',
    operator: 'equals',
    value: '23',
    extentionId: 'AEC60599-F25C-4A42-B847-431FFD502648',
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
    fieldsString += `<Properties>${input.fields[i]}</Properties>`;
  }

  soap.execute(authConfig, 'Retrieve', `<soapenv:Body>
     <RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
        <RetrieveRequest>
           <ObjectType>DataExtensionObject[${input.extentionId}]</ObjectType>
           ${fieldsString}
           <Filter xsi:type="SimpleFilterPart">
              <Property>${input.field}</Property>
              <SimpleOperator>${input.operator}</SimpleOperator>
              <Value>${input.value}</Value>
           </Filter>
        </RetrieveRequest>
     </RetrieveRequestMsg>
  </soapenv:Body>`, next);
};


/*
<Filter xsi:type="SimpleFilterPart">
   <Property>CustomerKey</Property>
   <SimpleOperator>equals</SimpleOperator>
   <Value>Testing_Forigen_Char_key</Value>
</Filter>
*/

/*
sfmc.modules.dataExtentions.list(auth, (err, data) => {
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
</soapenv:Body>`, next);
};


// TODO => add fields here
const create = (authConfig, input, next) => {
  /*
  sfmc.modules.dataExtentions.create(auth, {
    name: 'created_by_timothy',
    customerKey: 'xxxxxx',
  }, (err, data) => {
    console.log(data);
  });
  */

  soap.execute(authConfig, 'Create', `<soapenv:Body>
    <CreateRequest xmlns="http://exacttarget.com/wsdl/partnerAPI">
        <Options></Options>
        <Objects xmlns:ns1="http://exacttarget.com/wsdl/partnerAPI" xsi:type="ns1:DataExtension">
            <CustomerKey>${input.customerKey}</CustomerKey>
            <Name>${input.name}</Name>
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
            <Fields>
                <Field>
                    <CustomerKey>EmailAddress_Key</CustomerKey>
                    <Name>EmailAddress</Name>
                    <FieldType>EmailAddress</FieldType>
                </Field>
                <Field>
                    <CustomerKey>ChannelUser_Key</CustomerKey>
                    <Name>ChannelUser</Name>
                    <FieldType>Text</FieldType>
                </Field>
                <Field>
                    <CustomerKey>ChannelUser_EmailAddress_Key</CustomerKey>
                    <Name>ChannelUser_EmailAddress</Name>
                    <FieldType>EmailAddress</FieldType>
                </Field>
                <Field>
                    <CustomerKey>Demographic_Address_Key</CustomerKey>
                    <Name>Demographic_Address</Name>
                    <FieldType>Text</FieldType>
                </Field>
            </Fields>
        </Objects>
    </CreateRequest>
</soapenv:Body>`, next);
};


module.exports = {
  list,
  info,
  search,
  create,
};
