public with sharing class MovieController {
    private MovieService movieService = new MovieService();

    @AuraEnabled(cacheable = true)
    public static List<MovieWrapper> getAllMovies(){
        try {
            return MovieWrapper.getMovieWrapperList(movieService.getAll());
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public class MovieWrapper {
        @auraEnabled 
        public String title{get;set;}
        public String image{get;set;}
        public String body{get;set;}

        public MovieWrapper(String title, String image, String body){
            this.title = title;
            this.image = image;
            this.body = body;
        }

        public static List<MovieWrapper> getMovieWrapperList(List<Movie__c> movies){
            List<MovieWrapper> moviesWrapper = new List<MovieWrapper>();
            for(Movie__c mv: movies){
                MovieWrapper mw = new MovieWrapper(mv.Name, mv.PosterImage__c, mv.Name);
                moviesWrapper.add(mw);
            }
            return moviesWrapper;
        }
    }
}
