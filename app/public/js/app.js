$(document).ready(function() {
  $.ajax({
    type: 'POST',
    url: '/recipients',
    success: function(response) {
      var $select = $('#recipient');

      for (var idx in response) {
        $select.append(
          '<option value=' +
            response[idx]._id +
            '>' +
            response[idx].name +
            '</option>',
        );
      }
    },
    error: function(err) {
      console.log(err);
    },
  });
});
