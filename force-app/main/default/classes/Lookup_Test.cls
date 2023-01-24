@isTest
public with sharing class Lookup_Test {
    static List<Actor__c> actors;

    static{
        /* Actors */
    Map<String, Object> actor1 = new Map<String, Object>{
        'Name' => 'Robert De Niro'
      };
      Map<String, Object> actor2 = new Map<String, Object>{
        'Name' => 'Robert Downey'
      };
      actors = (List<actor__c>) TestDataFactory.createSObjects(
        'Actor__c',
        new List<Map<String, Object>>{ actor1, actor2 }
      );
    }

    @TestSetup
    static void makeData(){
        insert actors;
    }

    @IsTest
    static void searchActorsWithNoFilter(){
        List<Actor__c> actorsResult;
        Test.startTest();
        /* System.runAs(contextuser){
            
        } */
        actorsResult = (List<Actor__c>) Lookup.search('ro', 'Actor__c', '');
        Test.stopTest();
        System.assertEquals(2, actorsResult.size(), 'searchActors Test');
        
    }

    @IsTest
    static void searchAllActors(){
        List<Actor__c> actorsResult;
        Test.startTest();
        /* System.runAs(contextuser){
            
        } */
        actorsResult = (List<Actor__c>) Lookup.search('', 'Actor__c', '');
        Test.stopTest();
        System.assertEquals(2, actorsResult.size(), 'searchActors Test');
        
    }
}
