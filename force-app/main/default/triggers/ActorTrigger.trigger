trigger ActorTrigger on Actor__c (after delete) {
    new ActorTriggerHandler().run();
}