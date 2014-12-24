(function($, _) {

  var $roomForm = $('#make-room');

  function prepareRoomForm() {
    $roomForm.submit(function(e) {
      e.preventDefault();
      $roomForm.prop('disabled', true);

      var url = $roomForm.attr('action'),
          roomName = $roomForm.find('input:text[name="roomName"]').val();

      $.post(url, {name: roomName}, function(data) {
        console.log(data);
      });
    });
  }

  $(function() {
    prepareRoomForm();
  })
})(window.jQuery, window._);