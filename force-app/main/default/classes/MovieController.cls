public with sharing class MovieController {
    private static String sObjectType = 'Movie__c';
    private static String junctionsObjectType = 'MovieActor__c';

    @AuraEnabled(cacheable = false)
    public static string createMovie(List<Map<String,Object>> movies, List<Map<String,Object>> actors){
        List<SObject> createdMovie;
        List<Map<String,Object>> movieActorsToBeCreated = new List<Map<String,Object>>();
        System.debug('MovieController Start::createMovies');
        try {
            /* First create movies (parent) */
            createdMovie = MovieService.createRecords(sObjectType, movies);
            for(Map<String,Object> actor: actors){
                movieActorsToBeCreated.add(new Map<String,Object>{'Actor__c'=> actor.get('id'), 'Movie__c'=> createdMovie[0].Id});
            }
            /* Second create junction objects (child to movie) */
            MovieService.createRecords(junctionsObjectType, movieActorsToBeCreated);
            System.debug('created movies: ' + createdMovie);
            return 'Movie created successfully';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable = true)
    public static List<MovieWrapper> getAllMovies(){
        List<Movie__c> movies;
        List<MovieWrapper> wMovies = new List<MovieWrapper>();
        try {
            movies = MovieService.getAll(sObjectType, new List<String>{'Id, Name, PosterImage__c, Description__c', 'Rating__c', 'Category__c', 'ReleaseDate__c'});
            for(Movie__c mv: movies){
                MovieWrapper mw = new MovieWrapper(mv);
                wMovies.add(mw);
            }
            return wMovies;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public class MovieWrapper {
        @auraEnabled
        public String id{get;set;}
        @auraEnabled
        public String title{get;set;}
        @auraEnabled
        public String image{get;set;}
        @auraEnabled
        public String body{get;set;}
        @auraEnabled
        public Decimal rating{get;set;}
        @auraEnabled
        public String category{get;set;}
        @auraEnabled
        public Date releaseDate{get;set;}

        public MovieWrapper(Movie__c mv){
            this.id = mv.id;
            this.title = mv.Name;
            this.image = mv.PosterImage__c;
            this.body = mv.Description__c;
            this.rating = mv.Rating__c;
            this.category = mv.Category__c;
            this.releaseDate = mv.ReleaseDate__c;
        }
    }
}
