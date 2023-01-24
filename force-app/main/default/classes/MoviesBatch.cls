global with sharing class MoviesBatch implements Database.Batchable<sObject>, Database.AllowsCallouts {
  private String query;

  global MoviesBatch(String soql) {
    query = soql;
  }

  // The batch job starts
  global Database.Querylocator start(Database.BatchableContext bc) {
    Date d = Date.today();
    /* String query = 'SELECT Id, Name FROM Movie__c Where ReleaseDate__c <= :d'; */
/*     String query = 'SELECT Id, Name FROM Account';
 */    System.debug('>>>> start ' + query);
    return Database.getQuerylocator(query);
  }

  // The batch job executes and operates on one batch of records
  global void execute(Database.BatchableContext bc, List<sObject> scope) {
    System.debug('>>>> execute ' + scope.size());
    MovieUtility.importMoviesFromRapidApi();
/*     /*     MovieUtility.updateReleasedMovies(scope);*/
    System.debug('execute end');
  }

  // The batch job finishes
  global void finish(Database.BatchableContext bc) {
    AsyncApexJob job = [
      SELECT Id, Status
      FROM AsyncApexJob
      WHERE Id = :bc.getJobId()
    ];
    System.debug('>>>> finish ' + job.Status);
  }
}
