public with sharing class ActorTriggerHandler extends TriggerHandler {
    private Map<Id, Actor__c> oldActorMap;
    public ActorTriggerHandler() {
        this.oldActorMap = (Map<Id, Actor__c>) Trigger.oldMap;
    }

    public override void afterDelete(){
        Map<Id, MovieActor__c> movieActorLst = new Map<Id, MovieActor__c>([SELECT Id, Actor__c, Movie__c FROM MovieActor__c limit 50000]);
        MovieActorTriggerHelper.calculateGenderPercentage(movieActorLst);
    }
}
