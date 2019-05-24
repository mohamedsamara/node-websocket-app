$(document).ready(function() {
  if (window.location.pathname == '/chats') {
  } else if (window.location.pathname == '/chat/add') {
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

$('#chat-submit').on('click', function() {
  var conversationId = $('#conversation').attr('data-id');
  var body = $('#message').val();

  socket.emit('new message', {
    conversationId: conversationId,
    sender: sender,
    body: body,
  });
});

$('#message').keypress(function() {
  var participant = $('#participant').attr('data-sender');
  console.log('participant', participant);
  socket.emit('typing', participant);
});

socket.on('typing', function(data) {
  console.log('data--->', data);

  $('#typing').html(
    '<label>' + data + '</label><span>is typing a message...</span>',
  );

  // feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});

socket.on('new message', function(data) {
  data = data[0];

  $('#message').val('');

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
