var express = require('express');
var app = express();
var fs = require('fs');
var https = require('https');
var crontab = require('node-crontab');

var darkskyKey = 'deabbdb3d55587039f9a943e14a54788';
var googleKey = 'AIzaSyATW6uZRYV-1qPrqtjz8aBbP59FFhlyyEk';
var imoKey = "KjHbDNRkbf18mYI";

const FitbitApiClient = require("fitbit-node");

const client = new FitbitApiClient({
    clientId: "22CMK5",
    clientSecret: "d391d1e81089552170d9f62f9e40e2ad",
    apiVersion: '1.2' // 1.2 is the default
});

const clientTwo = new FitbitApiClient({
    clientId: "22CMJD",
    clientSecret: "2cb14b7da462db2afea1ee8c56000f49",
    apiVersion: '1.2' // 1.2 is the default
});

const clientThree = new FitbitApiClient({
    clientId: "22CMJJ",
    clientSecret: "95d452fea2a0e7e0d93eea14376f82d3",
    apiVersion: '1.2' // 1.2 is the default
});

const clientFour = new FitbitApiClient({
    clientId: "22CMJK",
    clientSecret: "848059faa5fb0a720de823852580033a",
    apiVersion: '1.2' // 1.2 is the default
});

//PETFINDER STUFF
var petfinderPromise = require('petfinder-promise')('e6752f48bcc7f62240703ed31a06f80d','88a51ac7576628db58476164025395b8');
var petfinder = require('pet-finder-api')('e6752f48bcc7f62240703ed31a06f80d','88a51ac7576628db58476164025395b8');
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
};

// Get a list of cat breeds
// petfinderPromise.pet.find(location="Chicago,IL",array=[breed="cat"]).then(function (breeds) {
//   breeds.forEach(function (breed) {
//       console.log(breed);
//   })
// }).catch(function (err) {
//     console.log('Error: ' + err.message);
// });
// char* host = "api.coinmarketcap.com";
// String url = "/v1/ticker/bitcoin/";

// var petOptions = {
//     animal : "cat",
//     count : 2
// }

// var shelterOptions = {
//     status : "X",
//     count : 5
// }

// petfinder.findPet('60640',petOptions, function(err, breeds) {
//     console.log(breeds)
// });

// petfinder.getPet("39524493",{id:"39524493"},function (err, breed){
//     console.log(breed);
//     fs.writeFile ("public/breeds.json", JSON.stringify(breed), function(err) {
//             if (err) throw err;
//             console.log('complete');
//         }
//     );
// });

// petfinder.getPetsInShelter('IL245',shelterOptions, function(err, breeds) {
//     console.log(breeds)
//     console.log(breeds.length)
// });

app.set('port', (process.env.PORT || 5000));
app.use(allowCrossDomain);
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {

    var requestParameters = request.query;
    var durationTime = 5;

    if(requestParameters.durationAmount){
        durationTime = requestParameters.durationAmount
    }

    if(requestParameters.cryptoType){
        var cryptoType = requestParameters.cryptoType;
        https.get('https://api.coinmarketcap.com/v1/ticker/'+cryptoType+'/', (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            var parsedCryptoJSON = JSON.parse(data);
            fs.writeFile ("public/crypto.json", JSON.stringify(parsedCryptoJSON), function(err) {
                    if (err) throw err;
                    console.log('complete');
                }
            );
        });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }

    // var jobIds = [];
    //
    // jobId = crontab.scheduleJob("*/"+durationTime+" * * * *", function(){
    //     var count = jobIds.length;
    //     if(jobIds[0]!== jobId){
    //         jobIds.push(jobId);
    //     }

        https.get('https://api.coinmarketcap.com/v1/ticker/'+cryptoType+'/', (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                var parsedCryptoJSON = JSON.parse(data);
                fs.writeFile ("public/crypto.json", JSON.stringify(parsedCryptoJSON), function(err) {
                        if (err) throw err;
                        console.log('complete');
                    }
                );
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });

    response.render('pages/index')
});

app.get("/meteorshower", (req, res) => {
    var d = new Date();
    var meteorObservationDate = d.getTime();
    var meteorObservationsAmount = null;
    var moonPhase = null;
    var weatherForecast = "";
    var location = "Chicago,IL";
    var meteorShowers = fs.readFileSync("public/meteor-shower-calendar.json");
    var meteorContent = JSON.parse(meteorShowers);
    console.log(meteorContent);
    console.log(meteorObservationDate);

    //Google Maps API
    https.get('https://maps.googleapis.com/maps/api/geocode/json?address='+location+'&key='+googleKey, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            jsonData = JSON.parse(data);
            var lat = jsonData.results[0].geometry.location.lat;
            var long = jsonData.results[0].geometry.location.lng;
            //Dark Sky API
            https.get('https://api.darksky.net/forecast/'+darkskyKey+'/'+lat+','+long,(resp) => {
                let data = '';
                resp.on('data', (chunk) => {
                    data += chunk;
                });
                resp.on('end', () => {
                    jsonData = JSON.parse(data);
                    moonPhase = jsonData.daily.data[0].moonPhase;
                    weatherForecast = jsonData.hourly.data[0].icon;
                    //IMO API
                    https.get("https://www.imo.net/members/api/vmdb_open_api/get_shower_rate?from=2018-02-20&to=2018-02-27&shower=ANT&api_key="+imoKey, (resp) => {
                        let data = '';
                        resp.on('data', (chunk) => {
                            data += chunk;
                        });
                        resp.on('end', () => {
                            jsonData = JSON.parse(data);
                            meteorObservationsAmount = jsonData.info.result_count;
                            var meteorShowerData = {
                                "meteorShowerName": "ANT",
                                "observationDate": meteorObservationDate,
                                "location": location,
                                "weatherForecast": weatherForecast,
                                "moonPhase": moonPhase,
                                "observation_amount": meteorObservationsAmount
                            };
                            var meteorJSON = JSON.stringify(meteorShowerData);
                            meteorJSON = JSON.parse(meteorJSON);
                            console.log(meteorJSON);
                            fs.writeFile ("public/meteorshower.json", JSON.stringify(meteorJSON), function(err) {
                                if (err) throw err;
                                console.log('complete');
                            });
                        })
                    });
                });
            });
        });
    });
    res.render('pages/index')
});

app.get("/login", (req, res)=>{
// Attempt to connect and execute queries if connection goes through
    var connection = new Connection(config);

    connection.on('connect', function(err)
        {
            if (err)
            {
                res.render(err)
            }
            else
            {
                console.log("we in it");
                res.render('pages/index')
            }
        }
    );


});

app.get("/weather", (req, res) => {
    https.get('https://api.coinmarketcap.com/v1/ticker/'+cryptoType+'/', (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            var parsedCryptoJSON = JSON.parse(data);
            fs.writeFile ("public/crypto.json", JSON.stringify(parsedCryptoJSON), function(err) {
                    if (err) throw err;
                    console.log('complete');
                }
            );
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });

});

app.get("/competitors", (req, res) => {
    var fitBitUsers = [];

    fs.readFile('public/user1.json', 'utf8', function(err, contents) {
        var userOne = contents;
        var userOneJSON = JSON.parse(userOne);
        fitBitUsers.push(userOneJSON);
        fs.readFile('public/user2.json', 'utf8', function(err, contents) {
            var userTwo = contents;
            userTwoJSON = JSON.parse(userTwo);
            fitBitUsers.push(userTwoJSON);

            var fitBitJSON = JSON.stringify(fitBitUsers);
            fs.writeFile ("public/fitbitusers.json", fitBitJSON, function(err) {
                if (err){
                    console.log(err);
                    throw err;
                }
                else{
                    res.send('FitBit JSON Created!!!')
                }
            });
        });
    });
});

// redirect the user to the Fitbit authorization page
app.get("/authorize", (req, res) => {
    // request access to the user's activity, heartrate, location, nutrion, profile, settings, sleep, social, and weight scopes
    res.redirect(client.getAuthorizeUrl('activity location profile', 'https://blooming-journey-66070.herokuapp.com/user1'));
});

// redirect the user to the Fitbit authorization page
app.get("/authorize2", (req, res) => {
    // request access to the user's activity, heartrate, location, nutrion, profile, settings, sleep, social, and weight scopes
    res.redirect(clientTwo.getAuthorizeUrl('activity location profile', 'https://blooming-journey-66070.herokuapp.com/user2'));
});

// redirect the user to the Fitbit authorization page
app.get("/authorize3", (req, res) => {
    // request access to the user's activity, heartrate, location, nutrion, profile, settings, sleep, social, and weight scopes
    res.redirect(clientThree.getAuthorizeUrl('activity location profile', 'https://blooming-journey-66070.herokuapp.com/user3'));
});

// redirect the user to the Fitbit authorization page
app.get("/authorize4", (req, res) => {
    // request access to the user's activity, heartrate, location, nutrion, profile, settings, sleep, social, and weight scopes
    res.redirect(clientFour.getAuthorizeUrl('activity location profile', 'https://blooming-journey-66070.herokuapp.com/user4'));
});

app.get("/user1", (req, res) => {
// handle the callback from the Fitbit authorization flow
        // exchange the authorization code we just received for an access token
        client.getAccessToken(req.query.code, 'https://blooming-journey-66070.herokuapp.com/user1').then(result => {
            var d = new Date();
            var currentYear = String(d.getFullYear());
            var currentMonth = d.getMonth() + 1;
            var currentDate =  d.getDate();

            if(currentMonth < 10){
                currentMonth = String("0"+String(d.getMonth() + 1));
            }
            else{
                currentMonth = String(currentMonth);
            }

            if(currentDate < 10){
                currentDate = String("0"+String(d.getDate()));
            }
            else{
                currentDate = String(currentDate);
            }

            var dateString = currentYear+"-"+currentMonth+"-"+currentDate;

            console.log('date is '+ dateString)


            // use the access token to fetch the user's profile information
            client.get("/activities/date/"+dateString+".json", result.access_token).then(results => {
               // var parsedUserJSON = JSON.parse(results[0]);
                fs.writeFile ("public/user1.json", JSON.stringify(results[0]), function(err) {
                        if (err){
                            console.log(err);
                            throw err;
                        }
                        else{
                            client.get("/profile.json", result.access_token).then(results => {
                                res.send("Thanks "+ results[0]['user']['firstName'] + ", you rock!");
                                jobId = crontab.scheduleJob("*/30 * * * *", function(){
                                    client.refreshAccessToken(result.access_token, result.refresh_token, 2400).then(results => {
                                        client.get("/activities/date/"+dateString+".json", result.access_token).then(results => {
                                            fs.writeFile ("public/user1.json", JSON.stringify(results[0]), function(err){
                                                if (err){
                                                    console.log(err);
                                                    throw err;
                                                }
                                                else{
                                                    console.log('wrote it');
                                                }
                                            });
                                        });

                                    });
                                });
                            });
                        }
                });
            }).catch(err => {
                res.status(err.status).send(err);
            });
        }).catch(err => {
            res.status(err.status).send(err);
        });
});

app.get("/user2", (req, res) => {
// handle the callback from the Fitbit authorization flow
    // exchange the authorization code we just received for an access token
    clientTwo.getAccessToken(req.query.code, 'https://blooming-journey-66070.herokuapp.com/user2').then(result => {
        var d = new Date();
        var currentYear = String(d.getFullYear());
        var currentMonth = d.getMonth() + 1;
        var currentDate =  d.getDate();

        if(currentMonth < 10){
            currentMonth = String("0"+String(d.getMonth() + 1));
        }
        else{
            currentMonth = String(currentMonth);
        }

        if(currentDate < 10){
            currentDate = String("0"+String(d.getDate()));
        }
        else{
            currentDate = String(currentDate);
        }

        var dateString = currentYear+"-"+currentMonth+"-"+currentDate;

        // use the access token to fetch the user's profile information
        clientTwo.get("/activities/date/"+dateString+".json", result.access_token).then(results => {
            // var parsedUserJSON = JSON.parse(results[0]);
            fs.writeFile ("public/user2.json", JSON.stringify(results[0]), function(err) {
                if (err){
                    console.log(err);
                    throw err;
                }
                else{
                    clientTwo.get("/profile.json", result.access_token).then(results => {
                        res.send("Thanks "+ results[0]['user']['firstName'] + ", you rock!");
                        jobId = crontab.scheduleJob("*/30 * * * *", function(){
                            clientTwo.refreshAccessToken(result.access_token, result.refresh_token, 2400).then(results => {
                                clientTwo.get("/activities/date/"+dateString+".json", result.access_token).then(results => {
                                    fs.writeFile ("public/user2.json", JSON.stringify(results[0]), function(err){
                                        if (err){
                                            console.log(err);
                                            throw err;
                                        }
                                        else{
                                            console.log('wrote it');
                                        }
                                    });
                                });

                            });
                        });
                    });
                }
            });
        }).catch(err => {
            res.status(err.status).send(err);
        });
    }).catch(err => {
        res.status(err.status).send(err);
    });
});

app.get("/user3", (req, res) => {
// handle the callback from the Fitbit authorization flow
    // exchange the authorization code we just received for an access token
    clientThree.getAccessToken(req.query.code, 'https://blooming-journey-66070.herokuapp.com/user3').then(result => {
        // use the access token to fetch the user's profile information
        clientThree.get("/activities/date/"+dateString+".json", result.access_token).then(results => {
            // var parsedUserJSON = JSON.parse(results[0]);
            fs.writeFile ("public/user3.json", JSON.stringify(results[0]), function(err) {
                if (err){
                    console.log(err);
                    throw err;
                }
                else{
                    clientThree.get("/profile.json", result.access_token).then(results => {
                        res.send("Thanks "+ results[0]['user']['firstName'] + ", you rock!");
                        jobId = crontab.scheduleJob("*/30 * * * *", function(){
                            clientThree.refreshAccessToken(result.access_token, result.refresh_token, 2400).then(results => {
                                clientThree.get("/activities/date/"+dateString+".json", result.access_token).then(results => {
                                    fs.writeFile ("public/user3.json", JSON.stringify(results[0]), function(err){
                                        if (err){
                                            console.log(err);
                                            throw err;
                                        }
                                        else{
                                            console.log('wrote it');
                                        }
                                    });
                                });

                            });
                        });
                    });
                }
            });
        }).catch(err => {
            res.status(err.status).send(err);
        });
    }).catch(err => {
        res.status(err.status).send(err);
    });
});

app.get("/user4", (req, res) => {
// handle the callback from the Fitbit authorization flow
    // exchange the authorization code we just received for an access token
    clientFour.getAccessToken(req.query.code, 'https://blooming-journey-66070.herokuapp.com/user4').then(result => {
        // use the access token to fetch the user's profile information
        clientFour.get("/activities/date/"+dateString+".json", result.access_token).then(results => {
            // var parsedUserJSON = JSON.parse(results[0]);
            fs.writeFile ("public/user4.json", JSON.stringify(results[0]), function(err) {
                if (err){
                    console.log(err);
                    throw err;
                }
                else{
                    clientFour.get("/profile.json", result.access_token).then(results => {
                        res.send("Thanks "+ results[0]['user']['firstName'] + ", you rock!");
                        jobId = crontab.scheduleJob("*/30 * * * *", function(){
                            clientFour.refreshAccessToken(result.access_token, result.refresh_token, 2400).then(results => {
                                clientFour.get("/activities/date/"+dateString+".json", result.access_token).then(results => {
                                    fs.writeFile ("public/user4.json", JSON.stringify(results[0]), function(err){
                                        if (err){
                                            console.log(err);
                                            throw err;
                                        }
                                        else{
                                            console.log('wrote it');
                                        }
                                    });
                                });

                            });
                        });
                    });
                }
            });
        }).catch(err => {
            res.status(err.status).send(err);
        });
    }).catch(err => {
        res.status(err.status).send(err);
    });
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
