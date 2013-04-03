$(document).ready(function(){  

  $('a.icon, #main-menu li a').each(function(index){
    if($(this).html() == $(this).text()) {
      $(this).html('<span>'+$(this).html()+'</span>');
    }
  });

  $('#admin-menu ul li a, a.repository').each(function(index){
    $(this).addClass('no_line');
    $(this).html('<span>'+$(this).html()+'</span>');
    
  });


  $('#q').attr('placeholder', $('label[for=q] a').text())
  $('label[for=q]').remove()

  $('div.tabs ul li a').each(function(index){
    $(this).addClass('no_line in_link');
    //$(this).html('<span>'+$(this).html()+'</span>');
    
  });
});