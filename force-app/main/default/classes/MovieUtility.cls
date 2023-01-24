public with sharing class MovieUtility {
  public MovieUtility() {
  }

  public static void importMoviesFromRapidApi() {
    System.debug('api call');
    Http http = new Http();
    HttpRequest request = new HttpRequest();
    request.setEndpoint('https://flixster.p.rapidapi.com/movies/get-popularity?zipCode=90002&radius=50');
    request.setMethod('GET');
    request.setHeader('X-RapidAPI-Key', '7079954fdcmshd613fd5aa8e2161p15ef16jsnf1c191aeb6d6');
    request.setHeader('X-RapidAPI-Host', 'flixster.p.rapidapi.com');
    HttpResponse response = http.send(request);
    List<Object> popularity;
    List<Object> opening;
    Map<String, Object> data;
    List<Map<String, Object>> movies = new List<Map<String, Object>>();
    List<Movie__c> convertedMovies = new List<Movie__c>();
    // If the request is successful, parse the JSON response.
    if (response.getStatusCode() == 200) {
      // Deserialize the JSON string into collections of primitive data types.
      Map<String, Object> results = (Map<String, Object>) JSON.deserializeUntyped(
        response.getBody()
      );
      data = (Map<String, Object>)results.get('data');
      popularity =(List<Object>) data.get('popularity');
      opening =(List<Object>) data.get('opening');
      for(Object movie: popularity){
        movies.add((Map<String, Object>)movie);
      }
      for(Object movie: opening){
        movies.add((Map<String, Object>)movie);
      }
      System.debug('movies:' + movies);
      if(movies.size() > 0){
          for(Map<String, Object> movie: movies){
            Map<String, Object> posterImage = (Map<String, Object> ) movie.get('posterImage');
            Movie__c newMovie = new Movie__c();
            newMovie.Category__c = 'Adventure';
            newMovie.Name = (String)movie.get('name');
            newMovie.TechEmsId__c = (String)movie.get('emsVersionId');
            newMovie.PosterImage__c = (String) posterImage.get('url');
            newMovie.ReleaseDate__c = System.today();
            convertedMovies.add(newMovie);
            /* newMovie.Category__c = ;
            newMovie.Category__c = ;
            newMovie.Category__c = ; */
          }
      }
    }
    Database.upsert(convertedMovies,Movie__c.TechEmsId__c,false);
  }

  public static void updateReleasedMovies(List<sObject> lstMovies){
    List<Movie__c> moviesToUpdate = new List<Movie__c>();
    for(SObject movie: lstMovies){
      Movie__c movieToUpdate = new Movie__c(Id = movie.Id);
      movieToUpdate.IsReleased__c = true;
      moviesToUpdate.add(movieToUpdate);
    }
    update moviesToUpdate;
  }

}
