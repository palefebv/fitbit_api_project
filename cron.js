var crontab = require('node-crontab');

var jobId = crontab.scheduleJob("*/2 * * * *", function(){ //This will call this function every 2 minutes
    console.log("It's been 2 minutes!");
});