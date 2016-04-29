

function loadYoutubePlayers(){
    $(".youtube").each(function(){
      loadPlayer($(this));
    });
}

function loadPlayer(element) { 
    if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') {
    
      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
      window.onYouTubePlayerAPIReady = function() {
        onYouTubePlayer(element);
      };
    
    } else {
    
      onYouTubePlayer(element);
    
    }
}

var player;

function onYouTubePlayer(element) {
console.log(element);
console.log(element.attr("id"));
console.log(element.data("video"));
player = new YT.Player(element.attr("id"), {
  height: '490',
  width: '880',
  videoId: element.data("video"),
  playerVars: { controls:1, showinfo: 0, rel: 0, showsearch: 0, iv_load_policy: 3 },
  events: {
    'onStateChange': onPlayerStateChange,
    'onError': catchError
  }
});
}

var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    // setTimeout(stopVideo, 6000);
    done = true;
  } else if (event.data == YT.PlayerState.ENDED) {
    location.reload();
  }
}

function onPlayerReady(event) {

  //if(typeof(SONG.getArtistId()) == undefined)
  //{
  //  console.log("undefineeeed"); 
  //} 
  //event.target.playVideo();   
}
function catchError(event)
{
  if(event.data == 100) console.log("De video bestaat niet meer");
}

function stopVideo() {
  player.stopVideo();
}