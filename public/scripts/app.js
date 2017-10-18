/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
// var data = [
//   {
//     "user": {
//       "name": "Newton",
//       "avatars": {
//         "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
//         "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
//         "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
//       },
//       "handle": "@SirIsaac"
//     },
//     "content": {
//       "text": "If I have seen further it is by standing on the shoulders of giants"
//     },
//     "created_at": 1461116232227
//   },
//   {
//     "user": {
//       "name": "Descartes",
//       "avatars": {
//         "small":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
//         "regular": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
//         "large":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
//       },
//       "handle": "@rd" },
//     "content": {
//       "text": "Je pense , donc je suis"
//     },
//     "created_at": 1461113959088
//   },
//   {
//     "user": {
//       "name": "Johann von Goethe",
//       "avatars": {
//         "small":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
//         "regular": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
//         "large":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
//       },
//       "handle": "@johann49"
//     },
//     "content": {
//       "text": "Es ist nichts schrecklicher als eine tätige Unwissenheit."
//     },
//     "created_at": 1461113796368
//   }];

//Convert Twitter timestamp to time since
function calculateSince(datetime)
{
  var tTime=new Date(datetime);
  var cTime=new Date();
  var sinceMin=Math.round((cTime-tTime)/60000);
  if(sinceMin==0)
  {
      var sinceSec=Math.round((cTime-tTime)/1000);
      if(sinceSec<10)
        var since='less than 10 seconds ago';
      else if(sinceSec<20)
        var since='less than 20 seconds ago';
      else
        var since='half a minute ago';
  }
  else if(sinceMin==1)
  {
      var sinceSec=Math.round((cTime-tTime)/1000);
      if(sinceSec==30)
        var since='half a minute ago';
      else if(sinceSec<60)
        var since='less than a minute ago';
      else
        var since='1 minute ago';
  }
  else if(sinceMin<45)
      var since=sinceMin+' minutes ago';
  else if(sinceMin>44&&sinceMin<60)
      var since='about 1 hour ago';
  else if(sinceMin<1440){
      var sinceHr=Math.round(sinceMin/60);
  if(sinceHr==1)
    var since='about 1 hour ago';
  else
    var since='about '+sinceHr+' hours ago';
  }
  else if(sinceMin>1439&&sinceMin<2880)
      var since='1 day ago';
  else
  {
      var sinceDay=Math.round(sinceMin/1440);
      var since=sinceDay+' days ago';
  }
  return since;
};

//Render arraw of tweets
function renderTweets (arr) {
  arr.forEach(function(r){
    var newTweet = createTweetElement(r);
    $('#tweets').prepend(newTweet);
  });
}

//Clone hidden element, then add information from database
function createTweetElement (tweet) {
  // Clone of the hidden article template from the DOM
  var $article = $('#tweet-template').clone();
  // Remove hidden property from Clone
  $article.removeAttr('hidden')
  // Add full name
  $article.find('.user').text(tweet['user']['name'])
  $article.find('.handle').text(tweet['user']['handle'])
  $article.find('.created').text(calculateSince(Date(tweet['created_at'])))
  $article.find('.tweet').text(tweet['content']['text'])
  $article.find('.avatar').attr('src', tweet['user']['avatars']['small'])
  return $article
}

//On DOM load
$(function() {
        $("#user-input").submit(function(event){
            event.preventDefault();
            var textInput = $(this).find('textarea').val();
            console.log(textInput);
            var textInputLength = $(this).find('textarea').val().length;
            console.log(textInputLength);
            if (textInput === false || textInput === null || textInput < 1) {
              alert('You didn\'t enter anything!');
            } else if (textInputLength > 140) {
              alert('Your tweet is too long. Keep it under 140 characters.')
            } else {
            $.ajax({
                    url:'/tweets/',
                    method: 'POST',
                    data: $(this).serialize(),
                    success:function(result){
                      renderTweets([result]);
                    }
            });
          }
        });

  // renderTweets(data)
  function loadTweets(){
    $.ajax({
      url: '/tweets/',
      method: 'GET',
      dataType: 'json',
      success: function(result){
        renderTweets(result);
      }
    })
  }
  loadTweets()
  // var form = $('#user-input');
  // var submit = $('#submitter');
  // $(submit).on('click', function(event){
  //   console.log('Button clicked. Performing AJAX call...');
  //   event.preventDefault();

  //   $(form).on('submit', function(event){
  //     event.preventDefault();
  //     console.log($(this).serialize());
  //   })

  //   $.ajax({
  //     url: 'http://localhost:8080/tweets/',
  //     method: 'GET',
  //     success: function(newPost) {
  //       console.log('Success: ', newPost);
  //       var length = newPost.length - 1;
  //       var tweet = newPost[length];
  //       console.log(tweet);
  //     }
  //   })
  // });

  // var $tweet = createTweetElement(data);
  // var $tweet2 = createTweetElement(data);
  // //
  // // // Test / driver code (temporary)
  // console.log($tweet); // to see what it looks like
  // $('#tweets').append($tweet);
  // $('#tweets').append($tweet2);
   // to add it to the page so we can make sure it's got all the right elements, classes, etc.
});