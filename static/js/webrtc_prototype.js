(function($, _, io, URL) {

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  var RTCPeerConnection = RTCPeerConnection || mozRTCPeerConnection;
  var sigChannel = io('/webrtc_prototype');
  var localStream = null;
  var peers = {};

  sigChannel.on('connect', function() {
    console.log('connected - adding user');
    sigChannel.emit('s:user:new', prompt('username?'));
  });


  sigChannel.on('c:peer:doOffer', function(userId) {
    console.log('Offering to ' + userId);

    var peer = new RTCPeerConnection();
    peers[userId] = peer;

    peer.onicecandidate = function(evt) {
      sigChannel.emit('s:ice:send', {
        candidate: evt.candidate,
        userId: userId
      });
    };

    // TODO
    peer.onaddstream = function(evt) {
      console.log('got stream: ' + evt.stream);
    };

    // TODO: refactor so this is first
    if (!localStream) {
      navigator.getUserMedia({
        video: true,
        audio: true
      }, function (stream) {
        var $video = $('video');
        $video.attr('src', URL.createObjectURL(stream));
        $video.play();

        localStream = stream;
      }, function (err) {
        console.log('getUserMedia error: ' + err);
      });
    }

    peer.addStream(localStream);

    peer.createOffer(function(desc) {
      peer.setLocalDescription(desc);
      sigChannel.emit('s:sdp:send', {
        desc: desc,
        userId: userId
      });
    });
  });

  sigChannel.on('c:sdp:send', function(data) {
    peers[data.userId].setRemoteDescription(new RTCSessionDescription(data.desc));
  });

  sigChannel.on('c:ice:send', function (candidate) {
    if (candidate)
      peer.addIceCandidate(new RTCIceCandidate(candidate));
  });

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