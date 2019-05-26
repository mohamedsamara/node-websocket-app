$(document).ready(function() {
  if (window.location.pathname == '/chat/add') {
    // populate recepients dropdown
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
  }
});

// socket setup
var socket = io.connect('http://localhost:5000');

var sender = $('#sender').attr('data-owner');

socket.on('new message', function(data) {
  data = data[0];

  $('#message').val('');
  var options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  $('.chat-window').animate(
    { scrollTop: $('.chat-window')[0].scrollHeight },
    'slow',
  );

  if (data.sender._id == sender) {
    $('.chat-window').append(
      "<div class='message'><label>You</label><p class='owner'><span>" +
        data.body +
        '</span></p><strong>' +
        new Date(data.createdAt).toLocaleString(options) +
        '</strong></div>',
    );
  } else {
    $('.chat-window').append(
      "<div class='message'><label>" +
        data.sender.name +
        "</label><p class='sender'><span>" +
        data.body +
        '</span></p><strong>' +
        new Date(data.createdAt).toLocaleString(options) +
        '</strong></div>',
    );
  }
});
