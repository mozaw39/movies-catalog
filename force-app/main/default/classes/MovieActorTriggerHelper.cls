public with sharing class MovieActorTriggerHelper {
    private static final string MALE_GENDER = 'Male';
    private static final string FEMALE_GENDER = 'Female';
    private static final Integer PERCENTAGE_SCALE = 2;
    public static void calculateNumberOfMovies(Map<Id, MovieActor__c> newMovieActorMap) {
        System.debug('-------MovieActorTriggerHandlerHelper/calculateNumberOfMovies: Start-------');
        /* variables */
        List<MovieActor__c> movieActorLst = [SELECT Id, Movie__c, Actor__c, Actor__r.NumberOfMovies__c FROM MovieActor__c WHERE Id IN :newMovieActorMap.keySet()];
        Map<Id, Actor__c> actorWithMoviesOccurence = new Map<Id, Actor__c>();
        Set<Id> newMovieActors = new Set<Id>();
        Map<Id, List<MovieActor__c>> actorToMovieActorMap = new Map<Id, List<MovieActor__c>>();
        SObjectAccessDecision securityDecision;
        /* get involved actors in the created movie */
        for(MovieActor__c movieAct: movieActorLst){
            Actor__c act = new Actor__c(Id = movieAct.Actor__c);
            act.NumberOfMovies__c = movieAct.Actor__r.NumberOfMovies__c;
            /* newMovieActors.add(movieAct.Actor__c); */
            actorWithMoviesOccurence.put(movieAct.Actor__c, act);
        }
        /* build a map for actors associated with the newly created movies */
        for(MovieActor__c movieAct: newMovieActorMap.values()){
            /* adding the first movie for an actor */
            if(actorToMovieActorMap.get(movieAct.Movie__c) == null){
                List<MovieActor__c> newList = new List<MovieActor__c>{movieAct};
                actorToMovieActorMap.put(movieAct.Movie__c, newList);
            /* the actor has already a movie added to the map */
            }else{
                actorToMovieActorMap.get(movieAct.Movie__c).add(movieAct);
            }
        }
        /* calculate number of movies to add/delete for each actor */
        for(MovieActor__c movieActor: movieActorLst){
            /* Actor__c actorToUpdate = new Actor__c(Id = actorId); */
            Decimal currentNumberOfMovies = actorWithMoviesOccurence.get(movieActor.Actor__c).NumberOfMovies__c;
            Actor__c act = new Actor__c(Id = movieActor.Actor__c);
            if(Trigger.isInsert){

                act.NumberOfMovies__c = currentNumberOfMovies + 1;
                /* actorToUpdate.NumberOfMovies__c = currentNumberOfMovies + 1; */
            } 
            if(Trigger.isDelete){
                act.NumberOfMovies__c = currentNumberOfMovies - 1;
                /* actorToUpdate.NumberOfMovies__c = currentNumberOfMovies - 1; */
            }
            actorWithMoviesOccurence.put(movieActor.Actor__c, act);
            /* actorsToUpdate.add(actorToUpdate); */
        }
        /* update actors with number of movies */
        /* update actorsToUpdate; */
        /* Security check */
      securityDecision = Security.stripInaccessible(
        AccessType.UPDATABLE,
        actorWithMoviesOccurence.values()
      );
        update securityDecision.getRecords();
        System.debug('-------MovieActorTriggerHandlerHelper/calculateNumberOfMovies: End-------');
    }

    public static void calculateGenderPercentage(Map<Id, MovieActor__c> movieActorMap){
        System.debug('-------MovieActorTriggerHandlerHelper/calculateGenderPercentage: Start-------');
        /* variables */
        List<MovieActor__c> movieActorLst = movieActorMap.values();
        Set<Id> newMovies = new Set<Id>();
        Map<Id, List<MovieActor__c>> movieCastMap = new Map<Id, List<MovieActor__c>>();
        Map<Id, List<MovieActor__c>> movieMaleCastMap = new Map<Id, List<MovieActor__c>>();
        Map<Id, List<MovieActor__c>> movieFemaleCastMap = new Map<Id, List<MovieActor__c>>();
        List<Movie__c> moviesToUpdate = new List<Movie__c>();
        SObjectAccessDecision securityDecision;
        /* get created movies */
        for(MovieActor__c movieAct: movieActorLst){
            newMovies.add(movieAct.Movie__c);
        }
        /* build a map for movies associated with their actors */
        for(MovieActor__c movieAct: [SELECT Id, Movie__c FROM MovieActor__c WHERE Movie__c in :newMovies]){
            /* adding the first actor to the movie cast */
            if(movieCastMap.get(movieAct.Movie__c) == null){
                List<MovieActor__c> newList = new List<MovieActor__c>{movieAct};
                movieCastMap.put(movieAct.Movie__c, newList);
            /* the movie has already an actor added to the map */
            }else{
                movieCastMap.get(movieAct.Movie__c).add(movieAct);
            }
        }
        /* build a map for movies associated with their female actors */
        for(MovieActor__c movieAct: [SELECT Id, Movie__c FROM MovieActor__c WHERE Movie__c in :newMovies and Actor__r.Gender__c =: FEMALE_GENDER]){
            /* adding the first actor to the movie cast */
            if(movieFemaleCastMap.get(movieAct.Movie__c) == null){
                List<MovieActor__c> newList = new List<MovieActor__c>{movieAct};
                movieFemaleCastMap.put(movieAct.Movie__c, newList);
            /* the movie has already an actor added to the map */
            }else{
                movieFemaleCastMap.get(movieAct.Movie__c).add(movieAct);
            }
        }
        /* build a map for movies associated with their male actors */
        for(MovieActor__c movieAct: [SELECT Id, Movie__c FROM MovieActor__c WHERE Movie__c in :newMovies and Actor__r.Gender__c =: MALE_GENDER]){
            /* adding the first actor to the movie cast */
            if(movieMaleCastMap.get(movieAct.Movie__c) == null){
                List<MovieActor__c> newList = new List<MovieActor__c>{movieAct};
                movieMaleCastMap.put(movieAct.Movie__c, newList);
            /* the movie has already an actor added to the map */
            }else{
                movieMaleCastMap.get(movieAct.Movie__c).add(movieAct);
            }
        }
        /* calculate number of movies for each actor */
        for(Id movieId: movieCastMap.keySet()){
            Movie__c movieToUpdate = new Movie__c(Id = movieId);
            Decimal numberOfFemaleActors = (movieFemaleCastMap.get(movieId)==null)?0:movieFemaleCastMap.get(movieId).size();
            Decimal numberOfMaleActors = (movieMaleCastMap.get(movieId)==null)?0:movieMaleCastMap.get(movieId).size();
            Decimal numberOfActors = movieCastMap.get(movieId).size();
            /* Calculate percentage */
            movieToUpdate.MaleActorsPercentage__c = ((numberOfMaleActors/numberOfActors) * 100).setScale(PERCENTAGE_SCALE);
            movieToUpdate.FemaleActorsPercentage__c = ((numberOfFemaleActors/numberOfActors) * 100).setScale(PERCENTAGE_SCALE);
            moviesToUpdate.add(movieToUpdate);
        }
        securityDecision = Security.stripInaccessible(
        AccessType.UPDATABLE,
        moviesToUpdate
      );
        update securityDecision.getRecords();
        System.debug('-------MovieActorTriggerHandlerHelper/calculateGenderPercentage: End-------');
    }
}
