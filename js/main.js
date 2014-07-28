//query YouTube API for videos

//$('.video[data-myvidnumber=1]')

var YouTubeClient = (function() {
    var vidnumber = 0; //global to make sure the first video plays, and num of videos.
    var nextpagetoken = ''; //save the nextpagetoken after each API call
    var request = {}; //request params object


    /* setup the request object for the API call */
    var setupRequest = function() {
        var q = $('#query').val();
        var params = {};
        params.q = q;
        params.type = 'video';
        params.part = 'snippet';

        if (nextpagetoken) {
            params.pageToken = nextpagetoken;
        }
        console.log(params);
        request = gapi.client.youtube.search.list(params);
    };

    /* execute the API call */
    var executeRequest = function() {
        request.execute(function(response) { //execute the request, response is server's response

            nextpagetoken = response.nextPageToken; //save the nextpagetoken for further results

            _(response.items).forEach(function(item){
                console.log(item.snippet);
                var itemid = item.id.videoId;
                var itemtitle = item.snippet.title;
                var itemthumbnail = item.snippet.thumbnails.high.url;
                var youtubevidlink = 'http://www.youtube.com/v/' + itemid + '?version=3&enablejsapi=1';

                if (vidnumber === 0) {
                    youtubevidlink += '&autoplay=1';
                }

                replaceVideo(itemid);

                $('#search-container-sidebar').append( //create the video.
                    '<div class="thumbnail" data-myvidnumber="' + vidnumber + ' id="thumbnail_' + itemid + '">' + 
                        '<h4>' + itemtitle +  '</h4>' +
                        '<img data-myvidnumber="' + itemid + '" src="' + itemthumbnail + '"/>' +
                    '</div>'
                );
                vidnumber++;
            });
        });
    };

    /* setup the load button after some results were fetched */
    var setupLoadMoreVideosButton = function(){
        var loadmoreelement = $('#loadmore');
        loadmoreelement.show();

        

        var throttledGetNextVideos = _.throttle(function(){
            getNextVideos();
        }, 1000);
        loadmoreelement.click(throttledGetNextVideos);
    }

    /* get the next videos if we already have a nextpagetoken, hence a search already was made */
    var getNextVideos = function(){
        setupRequest();
        executeRequest();
    };

    /* remove everything to prepare for the next queries results */
    var removePreviousVideos = function(nextpage){
        listofvids = [];
        $('#search-container').html('');
        $('#search-container-sidebar').html('');
        vidnumber = 0;
        if (nextpage){
            nextpagetoken = '';
        }
    };

    /* main function to get all the youtube results to display correctly */
    var getYouTubeResults = function(){
        setupRequest(); //setup params for the request
        executeRequest(); //make API call after setting up request params
        setupLoadMoreVideosButton();
    };

    /* creates the youtube player for the videos */
    var replaceVideo = function(vidid){
        $('#player').remove();
        $('#playercontainer').append('<div id="player"></div>');

        player = new YT.Player('player', {
            height: '385',
            width: '640',
            videoId: vidid,
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    };


    /* first function that's called by googleapisetup
     * setup the listener for user's query 
     */
    var listenForInput = function(){
        getYouTubeResults();

        $('#query').bind('input',function() {
            if (this.value.match(/[^a-zA-Z0-9\-_\s]/g)) {
                alert('No special character searches!');
                return;
            }
            else {
                removePreviousVideos(true);
                getYouTubeResults();
            }
        });

        $('#search-container-sidebar').on('click', 'img', function(event){
            replaceVideo($(this).attr('data-myvidnumber'));
        });

        // insert iframe script tag dynamically (this is done in the docs)
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    return listenForInput;
})(player);