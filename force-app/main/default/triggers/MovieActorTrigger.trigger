trigger MovieActorTrigger on MovieActor__c (after insert, after delete, before delete) {
    new MovieActorTriggerHandler().run();
}