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
}
var ajaxBuilder = function(method, url, data) {
  return $.ajax({
    method : method,
    url : url,
    data : data
  });
}
$(function(){
  $('.btnRegister').click(function(){
    var userName = $('.tbNameRegister').val().trim(),
        email = $('.tbEmailRegister').val().trim(),
        password = $('.tbPasswordRegister').val().trim();
    if(userName == "" || email == "" || password == "" || !validateEmail(email))
      return;
    ajaxBuilder('post', 'http://localhost:1337/user/create', {'name' : userName, 'email' : email, 'encryptedPassword' : password}).done(function(res){
      if(res['name'] != "Error"){
        $('.tbNameRegister').val("");
        $('.tbEmailRegister').val("");
        $('.tbPasswordRegister').val("");
        $('.msgBox').html("<span class='success'>The user has been registered successfully.</span>");
      }
      else{
        $('.msgBox').html("<span class='failure'>Something has gone wrong, please check your inputs.</span>");
      }
    }).error(function(res){
        $('.msgBox').html("<span class='failure'>Something has gone wrong, please check your inputs.</span>");
    });

  });
})
