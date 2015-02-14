(function($, _, io, URL) {

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

  var ws = io('/webrtc_prototype');
  var id;

  ws.on('connect', function() {
    console.log('connected - adding user');
    ws.emit('user:new', prompt('username?'));
  });

  ws.on('user:pushId', function(data) {
    id = data;
    console.log(id);
  });

  function openSignalling() {

  }

  function offer() {

  }

  function answer() {

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