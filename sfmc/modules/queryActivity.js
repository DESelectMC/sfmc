const soap = require('../soap');
const xml = require('../xml.js');

/* retrieves all data extensions for this customer */
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
    </soapenv:Body>`, (error, data) => {
      if (typeof cb === 'function') {
        if (error) {
          console.log(error);
        }
        cb(error, data);
      }
    });
};

// append, update (enkel mogelijk als dataExtensions een primary key heeft), overwrite

/* create a new queryActivity
returns cb(error, objectId)
*/
const create = (authConfig, settings, cb) => {
  const name = xml.escapeXML(settings.name || `sfmc_${new Date().getTime()}`);
  const description = xml.escapeXML(settings.description);
  const query = xml.escapeXML(settings.query);
  soap.execute(authConfig, 'Create', `
  <soapenv:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <CreateRequest xmlns="http://exacttarget.com/wsdl/partnerAPI">
     <Options>
     </Options>
     <Objects xsi:type="QueryDefinition">
      <PartnerKey xsi:nil="true">
      </PartnerKey>
      <ObjectID xsi:nil="true">
      </ObjectID>
      <CustomerKey>${name}</CustomerKey>
      <Name>${name}</Name>
      <Description>${description}</Description>
      <QueryText>${query}</QueryText>
      <TargetType>DE</TargetType>
      <DataExtensionTarget>
       <CustomerKey>${settings.DECustomerKey}</CustomerKey>
       <Name>${settings.DEName}</Name>
      </DataExtensionTarget>
      <TargetUpdateType>Overwrite</TargetUpdateType>
     </Objects>
    </CreateRequest>
   </soapenv:Body>`, (error, data) => {
     console.log('result create queryActivity call SMFC' + JSON.stringify(data));
     if (error && typeof cb === 'function') {
       console.log(error);
       cb(error, null);
     } else {
       if (data.Results && data.Results.NewObjectID && typeof data.Results.NewObjectID !== 'undefined') {
         if (data && data.Results && data.OverallStatus) {
           if (data.OverallStatus === 'Error') {
             if (typeof cb === 'function') {
               cb((data && data.Results && data.Results.StatusMessage) ? data.Results.StatusMessage : 'Unknown error from SFMC API', null);
             }
           } else {
             if (typeof cb === 'function') {
               cb(null, data.Results.Object);
             }
           }
         } else {
           if (typeof cb === 'function') {
             cb('Unknown error from SFMC API', null);
           }
         }
       } else if (data.OverallStatus === 'Error') {
         if (typeof cb === 'function') {
           cb((data && data.Results && data.Results.StatusMessage) ? data.Results.StatusMessage : 'Unknown error from SFMC API', null);
         }
       } else {
         if (typeof cb === 'function') {
           cb('Unexpected error', null);
         }
       }
     }
   });
};


/*
<Name>${settings.name}</Name>
<Description>${settings.description}</Description>
*/

/* update a queryActivity. Returns a cb(error, data) */
const update = (authConfig, objectId, settings, cb) => {
  const name = xml.escapeXML(settings.extensionName);
  const query = xml.escapeXML(settings.query);
  soap.execute(authConfig, 'Update', `
  <soapenv:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <UpdateRequest xmlns="http://exacttarget.com/wsdl/partnerAPI">
     <Options />
     <Objects xsi:type="QueryDefinition">
     <ObjectID>${objectId}</ObjectID>
      <CustomerKey></CustomerKey>
      <QueryText>${query}</QueryText>
      <DataExtensionTarget>
       <CustomerKey>${settings.extensionId}</CustomerKey>
       <Name>${name}</Name>
      </DataExtensionTarget>
      <TargetUpdateType>Overwrite</TargetUpdateType>
     </Objects>
    </UpdateRequest>
   </soapenv:Body>`, (error, data) => {
     console.log('result update queryActivity call SMFC' + JSON.stringify(data));
     if (error && typeof cb === 'function') {
       console.log(error);
       cb(error, null);
     } else {
       if (data && data.Results && data.OverallStatus) {
         if (data.OverallStatus === 'Error') {
           if (typeof cb === 'function') {
             cb((data && data.Results && data.Results.StatusMessage) ? data.Results.StatusMessage : 'Unknown error from SFMC API', null);
           }
         } else {
           if (typeof cb === 'function') {
             cb(null, data);
           }
         }
       } else {
         if (typeof cb === 'function') {
           cb('Unknown error from SFMC API', null);
         }
       }
     }
   });
};

/* Starts execution of a queryActivity. Returns a cb(error, task) */
const run = (authConfig, objectId, cb) => {
  soap.execute(authConfig, 'Perform', `
  <soapenv:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <PerformRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
     <Action>Start</Action>
     <Definitions>
      <ns1:Definition xmlns:ns1="http://exacttarget.com/wsdl/partnerAPI" xsi:type="ns1:QueryDefinition">
       <ns1:PartnerKey xsi:nil="true"/>
       <ns1:ModifiedDate xsi:nil="true"/>
       <ns1:ObjectID>${objectId}</ns1:ObjectID>
      </ns1:Definition>
     </Definitions>
    </PerformRequestMsg>
   </soapenv:Body>`, (error, data) => {

     console.log('result run queryActivity call SMFC' + JSON.stringify(data));
     if (error && typeof cb === 'function') {
       console.log(error);
       cb(error, null);
     } else {
       if (data && data.Results && data.Results.Result && data.Results.Result.Task) {
         if (typeof cb === 'function') {
           cb(null, data.Results.Result.Task);
         }
       } else {
         if (typeof cb === 'function') {
           cb('Unknown error from SFMC API', null);
         }
       }
     }
   });
};

// get the status of a queryActivity tastk. status can be: Queued, Processing, Complete, Error. Returns a cb(error, results (object)) */
const status = (authConfig, taskId, cb) => {
  soap.execute(authConfig, 'Retrieve', `<soapenv:Body>
    <RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
       <RetrieveRequest>
          <ObjectType>AsyncActivityStatus</ObjectType>
          <Properties>Status</Properties>
          <Properties>StartTime</Properties>
          <Properties>EndTime</Properties>
          <Properties>TaskID</Properties>
          <Properties>ParentInteractionObjectID</Properties>
          <Properties>InteractionID</Properties>
          <Properties>Program</Properties>
          <Properties>StepName</Properties>
          <Properties>ActionType</Properties>
          <Properties>Type</Properties>
          <Properties>Status</Properties>
          <Properties>CustomerKey</Properties>
          <Properties>ErrorMsg</Properties>
          <Properties>CompletedDate</Properties>
          <Properties>StatusMessage</Properties>
          <Filter xsi:type="SimpleFilterPart">
             <Property>TaskID</Property>
             <SimpleOperator>equals</SimpleOperator>
             <Value>${taskId}</Value>
          </Filter>
       </RetrieveRequest>
    </RetrieveRequestMsg>
  </soapenv:Body>`, (error, data) => {
    console.log('result status queryActivity call SMFC' + JSON.stringify(data));
    if (error && typeof cb === 'function') {
      console.log(error);
      cb(error, null);
    } else {
      if (data && data.Results && data.Results.Properties && data.Results.Properties.Property) {
        const result = {
          moment: new Date().getTime(),
        };

        for (let i = 0; i < data.Results.Properties.Property.length; i += 1) {
          const name = data.Results.Properties.Property[i].Name;
          if (name === 'CompletedDate' || name === 'StatusMessage' || name === 'Status' || name === 'ErrorMsg') {
            result[name] = data.Results.Properties.Property[i].Value;
          }
        }

        if (typeof cb === 'function') {
          cb(null, result);
        }
      } else {
        if (typeof cb === 'function') {
          cb('Unknown error from SFMC API', null);
        }
      }
    }
  });
};

module.exports = {
  list,
  create,
  update,
  run,
  status,
};
