$(document).ready(function(){  

  var close_sidebar = $('<a/>', {href: '#',
                                 class: 'R close_sidebar icon',
                                 click: function(){
                                  if($(this).hasClass('close_sidebar'))
                                    {
                                    $('#sidebar').hide()
                                    $(this).addClass('show_sidebar')
                                    $(this).removeClass('close_sidebar')
                                    $('#content').data('margin-right', $('#content').css('margin-right'))
                                    $('#content').css('margin-right', '16px')
                                    $('#sidebar').before($(this))
                                    }
                                  else
                                    {
                                    $('#sidebar').show()
                                    $(this).removeClass('show_sidebar')
                                    $(this).addClass('close_sidebar')
                                    $('#content').css('margin-right',  $('#content').data('margin-right'))
                                    $('#sidebar').prepend($(this))                                      
                                    }

                                  }
                                })
  $('#sidebar').prepend(close_sidebar)

  var loc = location.href.split('#')
  if(loc.length>1)
    {
    if($('#tab-'+loc[1]).length==1)
      {
      showTab(loc[1])
      }
    }

  $('.tabs a').click(function(){
    var url = $(this).attr('href').split('?tab=')

    var loc = location.href.split('#')
    location.href = loc[0] + '#' + url[1];
    })


  var user_preferences = []
  user_preferences['top_menu_event'] = 'mouseover'
  $('#usability_user_preferences div').each(function(){
      user_preferences[$(this).attr('class')]=$(this).html()
      })

  $(document).scroll(function(){$('#top-menu a.sub_menu').popover('hide')});
 

  if(user_preferences['top_menu_event'] == 'mouseclick')
    {
    $('#top-menu a.sub_menu').bind('click', function(){$('#top-menu a.sub_menu').not($(this)).popover('hide')});
    $('#top-menu a.sub_menu').popover({html: "true",
                                        trigger: "click",
                                        placement: "bottom",
                                        container: 'body',
                                        content: function(){return $('.'+$(this).attr('data-content-class')).map(function() {return $(this).html()}).get().join('')}
                                            })
    $('#top-menu a.sub_menu, a.my-name').click(function(){return false;})
    $(document).click(function(event){
        if($(event.target).parents('div.popover').length == 0)
          $('#top-menu a.sub_menu').popover('hide')
      });
    }

  if(user_preferences['top_menu_event'] == 'mouseover')
    {
     $('#top-menu a.sub_menu').popover({html: "true",
                                        trigger: "manual",
                                        //delay: { show: 0, hide: 1000 },
                                        placement: "bottom",
                                        container: 'body',
                                        content: function(){return $('.'+$(this).attr('data-content-class')).map(function() {return $(this).html()}).get().join('')}
                                            }).mouseenter(function(e) {
                                                                      var t = $(this)
                                                                      window.setTimeout(function(){
                                                                                                   if(typeof $(document).data('popover_enter')=='undefined' || !$(document).data('popover_enter'))
                                                                                                      {
                                                                                                      t.popover('show'); 
                                                                                                      $('#top-menu a.sub_menu').not(t).popover('hide')
                                                                                                      }
                                                                                                   }, 100)

                                                                      }).mouseleave(function(e) {
                                                                      var t = $(this)
                                                                      window.setTimeout(function(){
                                                                                                  if(typeof $(document).data('popover_enter')=='undefined' || !$(document).data('popover_enter'))
                                                                                                    t.popover('hide')
                                                                                                  }, 100)
                                                                      })
    jQuery(document.body).on("mouseenter", 'div.popover', function(){$(document).data('popover_enter', true)})
    jQuery(document.body).on("mouseleave", 'div.popover', function(){$(document).data('popover_enter', false), $(this).hide()})

    /*$('#top-menu a.sub_menu').menuAim({
      activate: function() {alert('dadasdad')},
      enter: function() {alert('dadasdad')},
      exit: function() {alert('dadasdad')},
      submenuDirection: "above"
      });*/
    }


  $('.splitcontentleft ul').each(function(){
    if($(this).children().length==0)
      {
      $(this).remove();
      }
    //$(this).remove();
    });
    

  $('a.icon, #main-menu li a, #top-menu li a:not(:has(span))').each(function(index){
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
  $('#quick-search').insertAfter('#loggedas')

  $('div.tabs ul li a').each(function(index){
    $(this).addClass('no_line in_link');
    $(this).html('<span>'+$(this).html()+'</span>');
    
  });

  $('#q').focus(function(index){
    $(this).data('last_width', $(this).width())
    $(this).animate({
                    width: 250,
                    }, 300, 'swing');
    });

  $('#q').blur(function(index){
    $(this).animate({
                    width: $(this).data('last_width'),
                    }, 300, 'swing');
    });
});