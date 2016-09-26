if(typeof(String.prototype.trim) === "undefined")
{
    String.prototype.trim = function()
    {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}
String.prototype.capitalize=function(all){
    if(all){
       return this.split(' ').map(e=>e.capitalize()).join(' ');
    }else{
         return this.charAt(0).toUpperCase() + this.slice(1);
    }
}
var validateEmail = function(emailVal) {
  var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  if(filter.test(emailVal))
    return true;
  return false;
};
var ajaxBuilder = function(method, url, data) {
  return $.ajax({
    method : method,
    url : url,
    data : data
  });
};
var loadFriends = function(){
  $(function(){
    $.ajax({
      'url' : window.CA.appUrl + '/user/friends',
      'method' : 'post',
      'data' : {'_csrf' : $('.csrf-token-home').val()}
    }).done(function(res){
      if(res.status === 1) {
        var friends = JSON.parse(res.content);
        var htmlToAppend = "";
        for(var i=0 ; i<friends.length; i++)
          htmlToAppend += "<div class='row'><div class='col-lg-12'><div class='friend' friend-id='" + friends[i]['userId'] + "'>" + friends[i]['name'] + "</div></div></div>"
        $('.friends-box').empty();
        $('.friends-box').html(htmlToAppend);
        attachFriendsHandler();
      }
      else{
        //something gone wrong
      }
    });
  });
};

var attachFriendsHandler = function(){
  $('.friend').click(function(){
    $('.active-friend').removeClass('active-friend');
    $(this).addClass('active-friend');
    var recipientId = $(this).attr('friend-id');
    $('.chat-text-box').attr('data-recipient-id', recipientId);
  });
};

var attachButtonHandlers = function(){
  var emailId = $('.search-textbox').val().trim();
  var ajaxObject;
  $('.action-button').click(function() {
    if($(this).hasClass('friend-request-button')) {
      ajaxObject = ajaxBuilder("post", "/userfriend/create", {
        '_csrf' : $('.csrf-token-home').val(),
        'user_2' : $('.search-result').attr('data-id').trim(),
        'action' : 'add-friend'
      });
    }
    else if ($(this).hasClass('block-button')) {
      ajaxObject = ajaxBuilder("post", "/userfriend/create", {
        '_csrf' : $('.csrf-token-home').val(),
        'user_2' : $('.search-result').attr('data-id').trim(),
        'action' : 'block-friend'
      });
    }
    else if ($(this).hasClass('unblock-button')) {
      ajaxObject = ajaxBuilder("post", "/userfriend/create", {
        '_csrf' : $('.csrf-token-home').val(),
        'user_2' : $('.search-result').attr('data-id').trim(),
        'action' : 'unblock-friend'
      });
    }
    else if($(this).hasClass('cancel-request-button')) {
      ajaxObject = ajaxBuilder("post", "/userfriend/create", {
        '_csrf' : $('.csrf-token-home').val(),
        'user_2' : $('.search-result').attr('data-id').trim(),
        'action' : 'cancel-request'
      });
    }
    else if($(this).hasClass('accept-request-button')) {
      ajaxObject = ajaxBuilder("post", "/userfriend/create", {
        '_csrf' : $('.csrf-token-home').val(),
        'user_2' : $('.search-result').attr('data-id').trim(),
        'action' : 'accept-request'
      });
    }
    else if($(this).hasClass('unfriend-button')) {
      ajaxObject = ajaxBuilder("post", "/userfriend/create", {
        '_csrf' : $('.csrf-token-home').val(),
        'user_2' : $('.search-result').attr('data-id').trim(),
        'action' : 'unfriend'
      });
    }
    ajaxObject.done(function(res){
      if(res.status === 1) {
        searchFriendByEmail(emailId);
        loadFriends();
      }
    });
  });
};

var searchFriendByEmail = function(emailId) {
  $.ajax({
    'url' : window.CA.appUrl + '/search',
    'type' : 'post',
    'data' : {'_csrf' : $('.csrf-token-home').val(), 'emailId' : emailId}
  }).done(function(res) {
    if(res !== undefined || res !== "" || res !== {}){
      $('.search-results-box').empty();
      if(res.reqStatus === 0) {
        return;
      }
      switch(res.status) {
        case 0 : $('.search-results-box').html(
                    "<div class='row search-result' data-id='" + res.id + "'>\
                      <div class='col-lg-8 search-result-name'>" + res.name +
                      "</div>\
                      <div class='col-lg-2 search-result-friend-request'>\
                        Not Friends!\
                        <input type='button' class='btn btn-success friend-request-button action-button' value='Send Friend Request'/>\
                      </div>\
                      <div class='col-lg-2 search-result-block'>\
                        <input type='button' value='Block' class='btn btn-danger block-button action-button'>\
                      </div>");
                  break;
        case 1 : $('.search-results-box').html(
                    "<div class='row search-result' data-id='" + res.id + "'>\
                      <div class='col-lg-8 search-result-name'>" + res.name +
                      "</div>\
                      <div class='col-lg-2 search-result-friend-request'>\
                        Not Friends!\
                      </div>\
                      <div class='col-lg-2 search-result-block'>\
                        <input type='button' value='Unblock' class='btn btn-danger unblock-button action-button'>\
                      </div>");
                  break;
        case 2 : $('.search-results-box').html(
                    "<div class='row search-result' data-id='" + res.id + "'>\
                      <div class='col-lg-8 search-result-name'>" + res.name +
                      "</div>\
                      <div class='col-lg-2 search-result-friend-request'>\
                        <input type='button' value='Cancel Request' class='btn btn-info cancel-request-button action-button'>\
                      </div>\
                      <div class='col-lg-2 search-result-block'>\
                        <input type='button' value='Block' class='btn btn-danger block-button action-button'>\
                      </div>");
                  break;
        case 3 : $('.search-results-box').html(
                    "<div class='row search-result' data-id='" + res.id + "'>\
                      <div class='col-lg-8 search-result-name'>" + res.name +
                      "</div>\
                      <div class='col-lg-2 search-result-friend-request'>\
                        <input type='button' value='Accept Request' class='btn btn-success accept-request-button action-button'>\
                        <input type='button' value='Decline Request' class='btn btn-primary cancel-request-button action-button'>\
                      </div>\
                      <div class='col-lg-2 search-result-block'>\
                        <input type='button' value='Block' class='btn btn-danger block-button action-button'>\
                      </div>");
                  break;
        case 4 : $('.search-results-box').html(
                    "<div class='row search-result' data-id='" + res.id + "'>\
                      <div class='col-lg-8 search-result-name'>" + res.name +
                      "</div>\
                      <div class='col-lg-2 search-result-friend-request'>\
                        Already Friends!\
                        <input type='button' class='btn btn-success unfriend-button action-button' value='Unfriend'/>\
                      </div>\
                      <div class='col-lg-2 search-result-block'>\
                        <input type='button' value='Block' class='btn btn-danger block-button action-button'>\
                      </div>");
                  break;

      }
      attachButtonHandlers();
    }
  });
};

var searchFriend = function(searchBox){
  var emailId = $(searchBox).val().trim();
  if(emailId === "") {
    return;
  }
  if(!validateEmail(emailId)) {
    //prompt invalid email id
    return;
  }
  searchFriendByEmail(emailId);
};

$(function(){
  $('.search-textbox').keypress(function(e) {
    if(e.which == 13) {
      searchFriend(this);
    }
  });
  if($('.home-page').length > 0) {
    io.socket.get('/user/registerSocket', function(body, res){
      console.log(res);
    });
    loadFriends();
    $('chat-text-box').keypress(function(e) {
      if(e.which == 13) {
          var message = $('.chat-text-box').val().trim(),
              recipientId = $('.chat-text-box').attr('data-recipient-id').trim();
          if(message == "" || recipientId == "")
            return;
          message = $('.username').val().trim().capitalize() + " : " + message;
          io.socket.get('/user/sendMessage', {recipientId : recipientId, message : message}, function(resData, jwres){
            $('.chat-box').append('<div class="chat-message">' + message + '</div>');
          });
      }
    });
    io.socket.on('message', function(data){
      $('.chat-box').append('<div class="chat-message">' + data.message + '</div>');
    });
  }
  $(document).ajaxError(function(res){
    $('.msgBox').html("<span class='failure'>Something has gone wrong, please check your inputs.</span>");
  });
  $('.btnRegister').click(function(){
    var userName = $('.tbNameRegister').val().trim(),
        email = $('.tbEmailRegister').val().trim(),
        password = $('.tbPasswordRegister').val().trim();
    if(userName == "" || email == "" || password == "" || !validateEmail(email))
      return;
    ajaxBuilder('post', window.CA.appUrl + '/user/create', {'name' : userName, 'email' : email, 'encryptedPassword' : password, '_csrf' : $('.csrf-token-home').val()}).done(function(res){
      if(res['name'] != "Error"){
        $('.tbNameRegister').val("");
        $('.tbEmailRegister').val("");
        $('.tbPasswordRegister').val("");
        $('.msgBox').html("<span class='success'>The user has been registered successfully.</span>");
      }
      else{
        $('.msgBox').html("<span class='failure'>Something has gone wrong, please check your inputs.</span>");
      }
    });

  });
})
