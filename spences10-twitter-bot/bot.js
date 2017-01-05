// Dependencies =========================
var 
    twit = require('twit'),
    config = require('./config.js'),
    uniqueRandomArray = require('unique-random-array');
    
var Twitter = new twit(config);

// RANDOM QUERY STRING  =========================

// https://dev.twitter.com/rest/reference/get/search/tweets
// A UTF-8, URL-encoded search query of 500 characters maximum, including operators. 
// Queries may additionally be limited by complexity.
var queryString = uniqueRandomArray([
    '100daysofcode',
    'freecodecamp',
    'github',
    'vscode',
    'visual studio code',
    'nodejs',
    'node.js',
    'vuejs',
    'vue.js',
    'inferno_js',
    'inferno.js',
    'jekyll'
  ]);

// RETWEET BOT ==========================

// find latest tweet according the query 'q' in params

// result_type: options, mixed, recent, popular
// * mixed : Include both popular and real time results in the response.
// * recent : return only the most recent results in the response
// * popular : return only the most popular results in the response.

var retweet = function() {
    var params = {
        q: queryString(),  // REQUIRED
        result_type: 'mixed',
        lang: 'en'
    };
    Twitter.get('search/tweets', params, function(err, data) {
      // if there no errors
        if (!err) {
          // grab ID of tweet to retweet
            var retweetId = data.statuses[0].id_str;
            // Tell TWITTER to retweet
            Twitter.post('statuses/retweet/:id', {
                id: retweetId
            }, function(err, response) {
                if (response) {
                    console.log('Retweeted!!!' + ' Query String: ' + queryString());
                }
                // if there was an error while tweeting
                if (err) {
                    console.log('Something went wrong while RETWEETING... Duplication maybe...: ' + err + ' Query String: ' + queryString());
                }
            });
        }
        // if unable to Search a tweet
        else {
          console.log('Something went wrong while SEARCHING...');
        }
    });
}

// grab & retweet as soon as program is running...
retweet();
// retweet in every five minutes
setInterval(retweet, 300000);

// FAVORITE BOT====================

// find a random tweet and 'favorite' it
var favoriteTweet = function(){
  var params = {
      q: queryString(),  // REQUIRED
      result_type: 'mixed',
      lang: 'en'
  };
  
  // find the tweet
  Twitter.get('search/tweets', params, function(err,data){

    // find tweets
    var tweet = data.statuses;
    var randomTweet = ranDom(tweet);   // pick a random tweet

    // if random tweet exists
    if(typeof randomTweet != 'undefined'){
      // Tell TWITTER to 'favorite'
      Twitter.post('favorites/create', {id: randomTweet.id_str}, function(err, response){
        // if there was an error while 'favorite'
        if(err){
          console.log('CANNOT BE FAVORITE... Error: ' + err + ' Query String: ' + queryString());
        }
        else{
          console.log('FAVORITED... Success!!!' + ' Query String: ' + queryString());
        }
      });
    }
  });
};

// grab & 'favorite' as soon as program is running...
favoriteTweet();
// 'favorite' a tweet in every five minutes
setInterval(favoriteTweet, 300000);

// STREAM API for interacting with a USER =======
// set up a user stream
var stream = Twitter.stream('user');

// REPLY-FOLLOW BOT ============================
// what to do when someone follows you?
stream.on('follow', followed);

// ...trigger the callback
function followed(event) {
  console.log('Follow Event now RUNNING');
  // get USER's twitter handler (screen name)
  var name = event.source.name,
      screenName = event.source.screen_name;
  // function that replies back to every USER who followed for the first time
  tweetNow('Hi @' + screenName + ' thanks for the follow! What are you working on today?');
}

// function definition to tweet back to USER who followed
function tweetNow(tweetTxt) {
  var tweet = {
    status: tweetTxt
  };
  Twitter.post('statuses/update', tweet, function (err,data, response) {
    if(err){
      console.log('Cannot Reply to Follower. ERROR!: ' + err);
    }
    else{
      console.log('Reply to follower. SUCCESS!');
    }
  });
}

// function to generate a random tweet tweet
function ranDom (arr) {
  var index = Math.floor(Math.random()*arr.length);
  console.log('arr: ' + index);
  return arr[index];
}
