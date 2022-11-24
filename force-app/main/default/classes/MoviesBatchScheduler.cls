global with sharing class MoviesBatchScheduler implements Schedulable {

  public static void start(){
    //Seconds Minutes Hours Day_of_month Month Day_of_week optional_year
    MoviesBatchScheduler sc = new MoviesBatchScheduler();
    String hour = String.valueOf(Datetime.now().hour());
//You can add any no of Minute you want to add to schedule it for next
    String min = String.valueOf(Datetime.now().addMinutes(1).minute());
    String ss = String.valueOf(Datetime.now().second());

//parse to a cron expression
  String nextFireTime = ss + ' ' + min + ' ' + hour + ' * * ?';
    System.schedule('MoviesBatchScheduler', nextFireTime, sc);

}

    global void execute(SchedulableContext ctx){
        String soql = '';
        MoviesBatch batch = new MoviesBatch(soql);
        Database.executeBatch(batch, 1);
      }
}
