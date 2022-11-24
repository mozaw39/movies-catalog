public Abstract class Repository {

    public Repository(){

    }
    
    public Repository(String sObjectType){
        this.SObjectType = sObjectType;
    }
    public static List<SObject> getAll(String sObjectType){
        String query = 'SELECT FIELDS(ALL) FROM ' + sObjectType + 'WITH SECURITY_ENFORCED LIMIT 50000';
        return Database.query(query);
    }
}
