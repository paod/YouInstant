var youtubeclient = YouTubeClient; //get our own library.

/* this func is called automatically when JS client library loaded. */
function onClientLoad() {
    gapi.client.load('youtube', 'v3', setupYouTubeAPI);
}

/* called when YouTube API loaded. */
function setupYouTubeAPI() {
    gapi.client.setApiKey('AIzaSyCM46jqBEvDoxSQ3RI32waZl8civuEQbUo');
    youtubeclient(player);
}

/* when YouTube is loaded, this function is called */
var player; //global video player
function onYouTubeIframeAPIReady(videoid) {
    console.log('onyoutubeiframeapiready');
    player = new YT.Player('player', {
        height: '385',
        width: '640',
        videoId: 'iEd8fCgwMJU',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}


function onPlayerReady(event) {
    event.target.playVideo();
}

var done = false;

/* pause the initial or first video after 10sec */
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
      setTimeout(stopVideo, 10000);
      done = true;
    }
}

function stopVideo() {
    player.stopVideo();
}