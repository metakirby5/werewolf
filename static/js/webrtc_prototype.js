(function($, _, io, URL) {

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

  var sigChannel = io('/webrtc_prototype');

  sigChannel.on('connect', function() {
    console.log('connected - adding user');
    sigChannel.emit('user:new', prompt('username?'));
  });

  sigChannel.on('peer:doOffer', function(userId) {
    console.log('Offering to ' + userId);
    // join private channel
    var privateChannel = io('/webrtc_prototype/' + userId);
    sigChannel.emit('privateChannel:new', userId);
  });

  sigChannel.on('peer:doAnswer', function(userId) {
    console.log('Answering to ' + userId);
    // join private channel
    var privateChannel = io('/webrtc_prototype/' + userId);
  });

  function offer() {
    return 'OFFER';
  }

  function answer() {
    return 'ANSWER';
  }

  function breakIce(peer, channel) {
    peer.onicecandidate = function (evt) {
      channel.emit('ice:send', evt.candidate.ice);
    };

    channel.on('ice:send', function (candidate) {
      if (candidate)
        peer.addIceCandidate(new RTCIceCandidate(candidate));
    });
  }

  // Local video stuff
  //if (navigator.getUserMedia) {
  //  navigator.getUserMedia({
  //    video: true,
  //    audio: true
  //  }, function (stream) {
  //    var $video = $('video');
  //    $video.attr('src', URL.createObjectURL(stream));
  //    $video.play();
  //  }, function (err) {
  //    console.log('getUserMedia error: ' + err);
  //  });
  //}

})(window.jQuery, window._, window.io, window.URL);