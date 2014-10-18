$(document).ready(function(){app.c.init();});
/////////////////////////////////////////

var app={};
app.m={};
app.v={};
app.c={};
app.t={};

/////////////////////////////////////////

app.m.configs=configs;
app.m.fancies=false;

/////////////////////////////////////////

app.c.init=function(){
  Parse.initialize(app.m.configs.applicationID, app.m.configs.javascriptKey);
  app.v.init();
};

app.c.createUser=function(username, password, email){
  var user = new Parse.User();
  user.set("username", username);
  user.set("password", password);
  user.set("email", email);
    
  user.signUp(null, {
    success: function(user) {
      // Hooray! Let them use the app now.
      alert("You're in "+user.attributes.username+"!");
    },
    error: function(user, error) {
      // Show the error message somewhere and let the user try again.
      alert("Error: " + error.code + " " + error.message);
    }
  });

};

app.c.logInUser=function(username,password){
  Parse.User.logIn(username, password, {
  success: function(user) {
    // Do stuff after successful login.
    alert("You're in "+user.attributes.username);
    app.c.fetch();
  },
  error: function(user, error) {
    // The login failed. Check error to see why.
    //console.log(error);
  }
  });
};

app.c.createObject=function(){
  var FancyObject = Parse.Object.extend("FancyObject");
  var fancy = new FancyObject();
  fancy.set("userPointer", Parse.User.current());
  fancy.save({fancy: "so so fancy", }).then(function(object) {
    alert("yay! so fancy");
  });
};

app.c.fetch=function(){
  var query = new Parse.Query('FancyObject');

  // This include will make your query resut comes with the full object
  // instead of just a pointer
  query.include('userPointer');

  // Now you'll compare your local object to database objects
  query.equalTo('userPointer', Parse.User.current() );
  query.find({
    success: function(n) {
        app.m.fancies=n;
    }
  });
};

/////////////////////////////////////////
app.v.init=function(){
  app.v.layout();
  app.v.listeners();
};

app.v.listeners=function(){
  var $b=$("body");
  
  $b.on("click","button#signUp",function(){
    var username=$("input#signUp-username").val();    
    var password=$("input#signUp-password").val();
    var email=$("input#signUp-email").val();
    app.c.createUser(username,password,email);
    $("#createUser-modal").modal('hide');
  });
  
  $b.on("click","button#signIn",function(){
    var username=$("input#signIn-username").val();    
    var password=$("input#signIn-password").val();
    app.c.logInUser(username,password);
  });
};

app.v.layout=function(){
  var d="";
  d+=app.t.navbar();
  d+=app.t.jumbotron(app.t.modal(app.t.signUp() ) );
  $("body").html(d);
};

/////////////////////////////////////////

app.t.modal=function(html){
  var d="";
  d+="<!-- Button trigger modal -->";
  d+='<button class="btn btn-primary btn-lg" data-toggle="modal" data-target="#createUser-modal">';
  d+='Sign Up';
  d+='</button>';

  d+='<div class="modal fade" id="createUser-modal">';
  d+='<div class="modal-dialog">';
    d+='<div class="modal-content">';
      d+='<div class="modal-header">';
        d+='<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
        d+=html
    d+='</div><!-- /.modal-content -->';
  d+='</div><!-- /.modal-dialog -->';
d+='</div><!-- /.modal -->';
  return d;
};


app.t.jumbotron=function(html){
  if (!html){var html="";}
  var d="";
  d+="<div class='jumbotron'>";
    d+="<div class='container'>";
      d+="<h1>Welcome</h1>";
      d+=app.t.exposition();
      d+=html;
    d+=+"</div>";
  d+="</div>";
  return d;
};

app.t.navbar=function(){
  var d="";
    d+='<div class="navbar navbar-inverse navbar-fixed-top" role="navigation">';
      d+='<div class="container">';
        d+='<div class="navbar-header">';
          d+='<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">';
            d+='<span class="sr-only">Toggle navigation</span>';
            d+='<span class="icon-bar"></span>';
            d+='<span class="icon-bar"></span>';
            d+='<span class="icon-bar"></span>';
          d+='</button>';
          d+='<a class="navbar-brand" href="#">HOWTOWEB</a>';
        d+='</div>';
        d+='<div class="navbar-collapse collapse">';
          d+='<form class="navbar-form navbar-right" role="form">';
            d+='<div class="form-group">';
              d+='<input type="text" placeholder="Username" class="form-control" id="signIn-username">';
            d+='</div>';
            d+='<div class="form-group">';
              d+='<input type="password" placeholder="Password" class="form-control" id="signIn-password">';
            d+='</div>';
            d+='<button type="button" class="btn btn-success" id="signIn">Sign in</button>';
          d+='</form>';
        d+='</div><!--/.navbar-collapse -->';
      d+='</div>';
    d+="</div>";
  return d;
};

app.t.exposition=function(){
  var d="<p>To program is to think, but more clearly and transparently than any form of thinking you've ever experienced. To do what you're about to do, to write a program for other people, is to give your thinking to them.</p>";
  return d;
};

app.t.signUp=function(){
  var d="";
  d+='<h4 class="modal-title">Sign Up</h4>';
  d+='<div class="modal-body">';
  
  d+="<input type='text' class='form-control' id='signUp-username' placeholder='username'></input>";
  d+="<input type='text'  class='form-control' id='signUp-email' placeholder='email'></input>";
  d+="<input type='password'  class='form-control' id='signUp-password' placeholder='password'></input>";
  d+='</div>';
  
  d+='<div class="modal-footer">';
    d+='<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
    d+='<button type="button" class="btn btn-primary" id="signUp">Sign Up</button>';
  d+='</div>';
      
  return d;
};