/* abstract class used to service dynamic apex for service classes */
public abstract class Service {

  /* get records for given sobject & fields */
  public static List<SObject> getAll(
    String sObjectType,
    List<String> fieldsLst
  ) {
    System.debug('Service:getAll');
    String fields = String.join(fieldsLst, ',');
    String query = 'SELECT ' + fields + ' FROM ' + sObjectType + ' LIMIT 50000';
    List<SObject> sObjectList = Database.query(query);
    SObjectAccessDecision securityDecision = Security.stripInaccessible(
      AccessType.READABLE,
      sObjectList
    );
    sObjectList = securityDecision.getRecords();
    return sObjectList;
  }
  /* create records */
  public static List<SObject> createRecords(
    String typeName,
    List<Map<String, Object>> sObjectsLst
  ) {
    System.debug('Service Start::createRecords');
    List<SObject> sObjectsToInsert = new List<SObject>();
    SObjectAccessDecision securityDecision;
    try {
      for (Map<String, Object> so : sObjectsLst) {
        /* Get sobject type */
        SObject sObjectInstance = createObject(typeName);
        for (String fieldName : so.keySet()) {
          JSONParser parser = JSON.createParser(
            '{"":"' +
            so.get(fieldName) +
            '"}'
          );
          parser.nextToken();
          parser.nextValue();
          Schema.SObjectField field = sObjectInstance.getSobjectType()
            .getDescribe()
            .fields.getMap()
            .get(fieldName);
          String fieldType = field.getDescribe().getType().name();
          /* type attribution for those with fieldtype = null  */
          if (fieldType == 'PICKLIST') {
            fieldType = 'STRING';
          }
          if (fieldType == 'REFERENCE') {
            fieldType = 'ID';
          }
          sObjectInstance.put(
            fieldName,
            parser.readValueAs(Type.forName(fieldType))
          );

          /* System.debug('fieldName: ' + fieldName + ', fieldType: ' + fieldType + ' firname: ' + Type.forName(fieldType)); */
        }
        sObjectsToInsert.add(sObjectInstance);
      }
      /* Security check */
      securityDecision = Security.stripInaccessible(
        AccessType.CREATABLE,
        sObjectsToInsert
      );
      sObjectsToInsert = securityDecision.getRecords();
      insert sObjectsToInsert;
      return sObjectsToInsert;
    } catch (Exception e) {
      System.debug(e.getMessage());
    }
    return null;
  }
  /* returns sobject type */
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
