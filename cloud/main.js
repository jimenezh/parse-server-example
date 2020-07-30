// Android push test
// To be used with:
// https://github.com/codepath/ParsePushNotificationExample
// See https://github.com/codepath/ParsePushNotificationExample/blob/master/app/src/main/java/com/test/MyCustomReceiver.java


 Parse.Cloud.define('schedule', function(req, res){
   schedule = require('node-schedule');

   var params = req.params.params;
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
    console.log("scheduling job for ");
    var schRetVal= schedule.scheduleJob(newUTDate),
        function(){
          //add scheduled push notification
          var query = new Parse.Query(Parse.Installation)
            , data = {
                "alert" :"You have an election coming up!",
            };

            pushQuery.equalTo("deviceType", "android");

          //push_time is not supported in the parse-server.
          Parse.Push.send({
               where: query,
               data: data
            },
            {
               success: function () {
                   console.log("arguments", arguments);
                   console.log("User reminded of help today");
               },
               error: function (error) {
                 console.log("Error: " + error.code + " " + error.message);
              },
               useMasterKey: true
           });



      });
      console.log('test val go ', schRetVal);
      //If the schedule return value is empty (null) then send a failure reponse to the client app.
      //If the return value is not null then send a success response to the client app.
      if(schRetVal)
         return "Success"
      else
         return "Failed to Schedule Work Reminders. To start work, go to the Orders Screen"


});

Parse.Cloud.define('pushChannelTest', function(request, response) {

  // request has 2 parameters: params passed by the client and the authorized user
  var params = request.params;
  var user = request.user;

  var customData = params.customData;
  var launch = params.launch;
  var broadcast = params.broadcast;

  // use to custom tweak whatever payload you wish to send
  var pushQuery = new Parse.Query(Parse.Installation);
  pushQuery.equalTo("deviceType", "android");

  var payload = {};

  if (customData) {
      payload.customdata = customData;
  }
  else if (launch) {
      payload.launch = launch;
  }
  else if (broadcast) {
      payload.broadcast = broadcast;
  }

  // Note that useMasterKey is necessary for Push notifications to succeed.

  Parse.Push.send({
  where: pushQuery,      // for sending to a specific channel
  data: payload,
  }, { success: function() {
     console.log("#### PUSH OK");
  }, error: function(error) {
     console.log("#### PUSH ERROR" + error.message);
  }, useMasterKey: true});


});
