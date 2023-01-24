public with sharing class MovieTriggerHandler extends TriggerHandler{
    private Map<Id, Movie__c> oldMovieMap;
    public MovieTriggerHandler() {
        this.oldMovieMap = (Map<Id, Movie__c>) Trigger.oldMap;
    }

    public override void beforeDelete(){
        System.debug('MovieTriggerHandler: beforeDelete');
        Map<Id, MovieActor__c> movieActorLst = new Map<Id, MovieActor__c>([SELECT Id, Actor__c, Movie__c FROM MovieActor__c WHERE Movie__c IN :oldMovieMap.keySet() limit 50000]);
        MovieActorTriggerHelper.calculateNumberOfMovies(movieActorLst);
    }
}
