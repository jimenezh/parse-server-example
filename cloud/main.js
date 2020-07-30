// Android push test
// To be used with:
// https://github.com/codepath/ParsePushNotificationExample
// See https://github.com/codepath/ParsePushNotificationExample/blob/master/app/src/main/java/com/test/MyCustomReceiver.java


 Parse.Cloud.define('schedule', async (request) =>{
   schedule = require('node-schedule');

   var params = request.params.params;
   var dateString = params.date

   console.log("Params are ", params, " with ", dateString, " of type ", typeof dateString);

   var newUTDate = new Date(dateString);

   console.log("New date is "+newUTDate);
    //This is required because if a date in the past then it should send the reminder notifications out in the next minute;
    var currentDate = new Date(Date.now() + (1 * 60000));
    console.log("Current date is "+ currentDate);

    if(newUTDate <= currentDate)
       newUTDate = currentDate;
    //not sure why this is required but this is the only way I could get te scheduler to work
    console.log("scheduling job for ", newUTDate);

    var schRetVal= schedule.scheduleJob(
         newUTDate,
        function(){
          //add scheduled push notification
          var pushQuery = new Parse.Query(Parse.Installation)
            , data = {
                "alert" :"You have an election coming up!",
            };

          pushQuery.equalTo("deviceType", "android");

          //push_time is not supported in the parse-server.
          return Parse.Push.send(
            {
               where: pushQuery,      // for sending to a specific channel
               data: {
                        title: "Hello from the Cloud Code Scheduler",
                        alert: "This is the alert",
                     },
            },
            {
               success: function() {
                     console.log("#### PUSH OK");
                  },
               error: function(error) {
                     console.log("#### PUSH ERROR" + error.message);
                  },
               useMasterKey: true
            });



      });
      console.log('test val go ', schRetVal);

      var is_date = function(input) {
         if ( Object.prototype.toString.call(input) === "[object Date]" )
            return true;
         return false;
            };
      console.log("Validity of date: ", is_date(newUTDate))


      if(schRetVal && is_date(newUTDate))
         return "Success"
      else
         return "Failed to Schedule Work Reminders. To start work, go to the Orders Screen"


});

Parse.Cloud.define('pushChannelTest', async (request) =>{

  // request has 2 parameters: params passed by the client and the authorized user
  var params = request.params;
  var user = request.user;

  var customData = params.customData;
  var launch = params.launch;
  var broadcast = params.broadcast;

  // use to custom tweak whatever payload you wish to send
  var pushQuery = new Parse.Query(Parse.Installation);
  pushQuery.equalTo("deviceType", "android");


  // Note that useMasterKey is necessary for Push notifications to succeed.

  return Parse.Push.send(
            {
               where: pushQuery,      // for sending to a specific channel
               data: {
                        title: "Hello from the Cloud Code",
                        alert: "This is the alert",
                     },
            },
            {
               success: function() {
                     console.log("#### PUSH OK");
                  },
               error: function(error) {
                     console.log("#### PUSH ERROR" + error.message);
                  },
               useMasterKey: true
            });


});
