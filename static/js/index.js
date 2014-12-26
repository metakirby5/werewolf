(function($, _) {

  var $roomForm = $('#make-room');

  function prepareRoomForm() {
    $roomForm.submit(function(e) {
      e.preventDefault();
      $roomForm.prop('disabled', true);

      var url = $roomForm.attr('action'),
          roomName = $roomForm.find('input:text[name="roomName"]').val();

      // TODO: make pub user-input
      $.post(url, {name: roomName, pub: true}, function(data) {
        console.log(data);
        // TODO: redirect to newly created room
      });
    });
  }

  $(function() {
    prepareRoomForm();
  })
})(window.jQuery, window._);