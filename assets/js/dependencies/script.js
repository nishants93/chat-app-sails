if(typeof(String.prototype.trim) === "undefined")
{
    String.prototype.trim = function()
    {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
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
      'url' : 'http://localhost:1337/user/friends',
      'method' : 'post',
      'data' : {'_csrf' : $('.csrf-token-home').val()}
    }).done(function(res){
      if(res.status === 1) {
        var friends = JSON.parse(res.content);
        var htmlToAppend = "";
        for(var i=0 ; i<friends.length; i++)
          htmlToAppend += "<div class='row'><div class='col-lg-12'><div class='friend' friend-id='" + friends[i]['userId'] + "'>" + friends[i]['name'] + "</div></div></div>"
        $('.friends-box').html(htmlToAppend);
      }
      else{
        //something gone wrong
      }
    });
  });
};

$(function(){
  if($('.home-page').length > 0) {
    io.socket.get('/user/registerSocket', function(body, res){
      console.log(res);
    });
    loadFriends();
    $(document).keypress(function(e) {
    if(e.which == 13) {
        var message = $('.chat-text-box').val().trim(),
            recipientId = $('.chat-text-box').attr('data-recipient-id').trim();
        if(message == "" || recipientId == "")
          return;
        io.socket.get('/user/sendMessage', {recipientId : recipientId, message : message}, function(resData, jwres){
          console.log(resData);
        });
    }
});
io.socket.on('foo', function(data){
  console.log(data);
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
    ajaxBuilder('post', window.CA.appUrl + '/user/create', {'name' : userName, 'email' : email, 'encryptedPassword' : password}).done(function(res){
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
