//On DOM ready
$(function() {

  $('#tweets').on('click', '.fa-heart', function () {
    $(this).toggleClass('like');
    if ($(this).attr('data-likes') == '0') {
      $(this).attr('data-likes', '1');
    } else {
      $(this).attr('data-likes', '0');
    }
    var likes = $(this).attr('data-likes');
    var user = $(this).parent().parent().find('.user').text();
    var data = {user: user, likes: likes}
    $.ajax({
      url: '/tweets/likes',
      method: 'POST',
      data: data,
      success: function(result){
        console.log(result);
      }
    });
  });

//Alerts user if their tweet is too long || their input is blank.
// Also, resets character counter && textarea on submit
  $("#user-input").submit(function(event){
      event.preventDefault();
      var textInput = $(this).find('textarea').val();
      var textInputLength = $(this).find('textarea').val().length;
      var counter = $(this).find('.counter');
      if (!textInput) {
        alert('You didn\'t enter anything!');
      } else if (textInputLength > 140) {
        alert('Your tweet is too long. Keep it under 140 characters.');
      } else {
      $.ajax({
              url:'/tweets/',
              method: 'POST',
              data: $(this).serialize(),
              //success:renderTweets;
              success:function(result){
                renderTweets([result]);
              }
      });
      this.reset();
      counter.text(140);
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
    });
  }
  loadTweets();

  // Compose button animation, as well as textarea auto-select
  $('#compose').on('click', function(){
    var $textarea = $('#user-input').find('textarea');
    $('.new-tweet').slideToggle();
    $textarea.select();
  });

  //Convert Twitter timestamp to time since post
  // https://www.sitepoint.com/calculate-twitter-time-tweet-javascript/
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
  }

  //Render array of tweets
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
    $article.removeAttr('hidden');
    // Add full name
    $article.find('.user').text(tweet['user']['name']);
    $article.find('.handle').text(tweet['user']['handle']);
    $article.find('.created').text(calculateSince(tweet['created_at']));
    $article.find('.tweet').text(tweet['content']['text']);
    $article.find('.avatar').attr('src', tweet['user']['avatars']['small']);
    return $article;
  }
});
