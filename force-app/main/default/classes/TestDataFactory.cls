public with sharing class TestDataFactory {
    public TestDataFactory() {

    }

    public static List<SObject> createSObjects(
        String typeName,
        List<Map<String, Object>> sObjectsLst
      ) {
        System.debug('TestDataFactory Start::createRecords');
        List<SObject> sObjectsToInsert = new List<SObject>();
        for(Map<String, Object> so: sObjectsLst){
          SObject sObjectInstance = createObject(typeName);
          for(String fieldName: so.keySet()){
            JSONParser parser = JSON.createParser('{"":"'+so.get(fieldName)+'"}');
            parser.nextToken();
            parser.nextValue();
            Schema.SObjectField field = sObjectInstance.getSobjectType().getDescribe().fields.getMap().get(fieldName);
            String fieldType = field.getDescribe().getType().name();
            if(fieldType == 'PICKLIST'){
              fieldType = 'STRING';
            }
            if(fieldType == 'REFERENCE'){
              fieldType = 'ID';
            }
            sObjectInstance.put(fieldName, parser.readValueAs(Type.forName(fieldType)));
            /* System.debug('TestDataFactory: fieldName: ' + fieldName + ', fieldType: ' + fieldType + ' firname: ' + Type.forName(fieldType)); */

          }
          sObjectsToInsert.add(sObjectInstance);
        }
        /* insert sObjectsToInsert; */
        /* System.debug('sObjectsToInsert: ' + sObjectsToInsert); */
        return sObjectsToInsert;
      }
    
      private static sObject createObject(String typeName) {
        Schema.SObjectType targetType = Schema.getGlobalDescribe().get(typeName);
        if (targetType == null) {
          // throw an exception
        }
    
        // Instantiate an sObject with the type passed in as an argument
        //  at run time.
        return targetType.newSObject();
      }
}
