@isTest
public with sharing class MovieController_Test {
  static List<Movie__c> movies;
  static List<Actor__c> actors;

  static {
    /* Actors */
    Map<String, Object> actor1 = new Map<String, Object>{
      'Name' => 'Robert De Niro',
      'Gender__c'=> 'Male'
    };
    Map<String, Object> actor2 = new Map<String, Object>{
      'Name' => 'Elizabeth Olsen',
      'Gender__c' => 'Female'
    };
    actors = (List<actor__c>) TestDataFactory.createSObjects(
      'Actor__c',
      new List<Map<String, Object>>{ actor1, actor2 }
    );
    /* Movies */
    Map<String, Object> movie1 = new Map<String, Object>{
      'Name' => 'movie title 1',
      'Category__c' => 'Adventure',
      'Description__c' => 'Description 1',
      'Rating__c' => 2,
      'releaseDate__c' => '2022-12-05'
    };
    Map<String, Object> movie2 = new Map<String, Object>{
      'Name' => 'movie title 2',
      'Category__c' => 'Adventure',
      'Description__c' => 'Description 2',
      'Rating__c' => 2,
      'releaseDate__c' => '2022-12-15'
    };
    movies = (List<Movie__c>) TestDataFactory.createSObjects(
      'Movie__c',
      new List<Map<String, Object>>{ movie1, movie2 }
    );
  }

  @isTest
  public static void getAllMovies() {
    test.startTest();
    insert movies;
    test.stopTest();
    List<Object> moviesResult = MovieController.getAllMovies();
    System.assertEquals(2, moviesResult.size(), 'getAllMovies test');
  }

  @isTest
  public static void createMovie() {
    Map<String, Object> movie1 = new Map<String, Object>{
      'Name' => 'movie title 1',
      'Category__c' => 'Adventure',
      'Description__c' => 'Description 1',
      'Rating__c' => 2,
      'releaseDate__c' => '2022-12-05'
    };
    Map<String, Object> movie2 = new Map<String, Object>{
      'Name' => 'movie title 2',
      'Category__c' => 'Adventure',
      'Description__c' => 'Description 2',
      'Rating__c' => 2,
      'releaseDate__c' => '2022-12-15'
    };
    Map<String, Object> actor = new Map<String, Object>();
    Map<String, Object> actor2 = new Map<String, Object>();
    test.startTest();
    insert actors;
    actor.put('id', actors[0].id);
    actor2.put('id', actors[1].id);
    String message1 = MovieController.createMovie(new List<Map<String, Object>>{movie1}, new List<Map<String, Object>>{actor, actor2});
    String message2 = MovieController.createMovie(new List<Map<String, Object>>{movie2}, new List<Map<String, Object>>{actor});
    test.stopTest();
    Movie__c mv = [SELECT Id, MaleActorsPercentage__c, FemaleActorsPercentage__c FROM Movie__c WHERE Name =:(String)movie1.get('Name') LIMIT 1];
    Actor__c act = [SELECT Id, NumberOfMovies__c FROM Actor__c WHERE Id =:actors[0].id LIMIT 1];
    System.assertEquals('Movie created successfully', message1, 'error creating movies');
    System.assertEquals('Movie created successfully', message2, 'error creating movies');
    System.assertEquals(2, act.NumberOfMovies__c, 'number of movies is incorrect');
    System.assertEquals(50, mv.MaleActorsPercentage__c, 'Male Percentage is incorrect');
    System.assertEquals(50, mv.FemaleActorsPercentage__c, 'Female Percentage is incorrect');
  }

  @isTest
  public static void createMovie_Negatif_Test() {
    /* bad field api name */
    Map<String, Object> movie1 = new Map<String, Object>{
        'title' => 'movie title 1',
        'Category__c' => 'Adventure',
        'Description__c' => 'Description 1',
        'Rating__c' => 2,
        'releaseDate__c' => '2022-12-05'
    };
    Map<String, Object> actor = new Map<String, Object>();
    test.startTest();
    insert actors;
    actor.put('id', actors[0].id);
    try {
        MovieController.createMovie(new List<Map<String, Object>>{movie1}, new List<Map<String, Object>>{actor});
    } catch (Exception e) {
        System.debug(e.getStackTraceString());
    }
    test.stopTest();
  }

}
