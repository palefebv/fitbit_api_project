const express = require('express')
var app = express()
const path = require('path')
const PORT = process.env.PORT || 5000
const FitbitApiClient = require( path.resolve( __dirname, "./fitbit.js" ) );
const fs = require('fs');
const https = require('https');
const url = require('url');
const crontab = require('node-crontab');
const OAuth2 = require('simple-oauth2').create;
const Base64 = require('js-base64').Base64;

const darkskyKey = 'deabbdb3d55587039f9a943e14a54788';
const googleKey = 'AIzaSyATW6uZRYV-1qPrqtjz8aBbP59FFhlyyEk';
const imoKey = "KjHbDNRkbf18mYI";
const querystring = require('querystring');

const client = new FitbitApiClient({
    clientId: "22CMJK",
    clientSecret: "848059faa5fb0a720de823852580033a",
    apiVersion: '1.2' // 1.2 is the default
});

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
    response.render('pages/index')
});

app.get("/authorize", (req, res) => {
    res.redirect("https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=22CNLN&redirect_uri=https://blooming-journey-66070.herokuapp.com/user1&scope=activity");
    // request access to the user's activity, heartrate, location, nutrion, profile, settings, sleep, social, and weight scopes
//    res.redirect(client.getAuthorizeUrl('activity location profile', 'https://blooming-journey-66070.herokuapp.com/user1'));
});

app.get("/user1", (req, res) => {
    var clientId = "22CMJK:848059faa5fb0a720de823852580033a";
    var authCode = Base64.encode(clientId);
    var codeParam = req.query.code;

    var post_data = querystring.stringify({
        'client_id' : '22942C',
        'grant_type' : 'authorization_code',
        'redirect_uri' : 'https://blooming-journey-66070.herokuapp.com/user1'
    });

    var post_options = {
        host: 'https://api.fitbit.com/oauth2/token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic '+authCode,
            'Content-Length': Buffer.byteLength(post_data)
        }
    }

    var post_req = http.request(post_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
        });
    });

    // post the data
    post_req.write(post_data);
    post_req.end();

    res.render('pages/index');

});

app.get("/user4", (req, res) => {
    //     res.render('pages/index')
    // handle the callback from the Fitbit authorization flow
    // exchange the authorization code we just received for an access token
    client.getAccessToken(req.query.code, 'https://blooming-journey-66070.herokuapp.com/user1').then(result => {
        res.render('pages/index')
    }).catch(err => {
        res.render('pages/index')
        // res.status(err.status).send(err);
    });
});


// express()
//   .use(express.static(path.join(__dirname, 'public')))
//   .set('views', path.join(__dirname, 'views'))
//   .set('view engine', 'ejs')
//   .get('/', (req, res) => res.render('pages/index'))
//   .listen(PORT, () => console.log(`Listening on ${ PORT }`))

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
