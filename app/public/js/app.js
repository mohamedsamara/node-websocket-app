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

// socket setup
var socket = io.connect('http://localhost:5000');

var sender = $('#sender').attr('data-owner');

$('#chat-submit').on('click', function() {
  var conversationId = $('#conversation').attr('data-id');
  var body = $('#message').val();

  socket.emit('new message', {
    conversationId: conversationId,
    sender: sender,
    body: body,
  });
});

socket.on('new message', function(data) {
  data = data[0];

  if (data.sender._id == sender) {
    $('.chat-window').append(
      "<p class='owner'><label>You</label><span>" +
        data.body +
        '</span></p><strong>' +
        new Date(data.createdAt).toLocaleString() +
        '</strong>',
    );
  } else {
    $('.chat-window').append(
      "<p class='sender'><label>" +
        data.sender.name +
        '</label><span>' +
        data.body +
        '</span></p><strong>' +
        new Date(data.createdAt).toLocaleString() +
        +'</strong>',
    );
  }
});
