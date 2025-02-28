$(document).ready(function(){
    $("#book").turn({ 
      width: 600,
      height: 400,
      autoCenter: true,
      elevation: 50,
      gradients: true,
    });
  
    $("#next-btn").click(function(){
      $("#book").turn("next");
    });
  
    $("#prev-btn").click(function(){
      $("#book").turn("previous");
    });
  });
  