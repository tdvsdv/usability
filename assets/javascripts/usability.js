$(document).ready(function(){  
/* ----- from a_small_things starts ---- */
  $('.contextual').next('div[style*="clear: both"]').remove().end().prev('div[style*="clear: both"]').remove()

  var contextual = $('#update').prev('.contextual')
  if(contextual.length>0) {
    $("<div/>", {"class": "H"}).insertBefore('#history').append($('#issue-changesets'), $('#history'));
    $("<div/>", {"class": "H"}).insertBefore('#update').append(contextual);
  }

  $('#add_filter_select, #available_columns, #group_by, #query_sort_criteria_attribute_0, #query_sort_criteria_attribute_1, #query_sort_criteria_attribute_2').each(function() {
    var selected = $(this).children('option:selected') //Only for firefox
    $(this).children('option').sort(function(a, b){    
            if ($(a).text() == 'NA') 
                {
                return 1;   
                }
            else if ($(b).text() == 'NA') 
                {
                return -1;   
                }       
            return ($(a).text().toLowerCase() > $(b).text().toLowerCase()) ? 1 : -1;
          }).appendTo($(this));
    selected.attr("selected", "selected")  //Only for firefox
  });

  $(document.body).on("click", "input.issue_due_date", function(){
      $(this).data('set_auto_val', false);
      $(this).removeClass("highlight");
    });

  $('td.project>a').each(function(index){
    $(this).parent().html($(this).html());
  });

  $('#ajax-indicator').remove();

  $('#sidebar').children('a[href$="issues?set_filter=1"]').each(function(index){
    $(this).prev('h3').remove();
    $(this).remove();
  });

  $('#sidebar').children('a[href$="gantt"]').remove();
  $('#sidebar').children('a[href$="report"]').next().remove();

  $("#attributes select[name*=assigned_to_id] option:contains(' мне ')").each(function(){
    $(this).remove();
  });


  $(document.body).on('click', 'form[data-remote="true"] input[type=submit], a.icon-del[data-remote="true"], a.show_loader[data-remote="true"]', function(){
    jQuery(document.body).data('ajax_emmiter', jQuery(this))
  });

  $(document).ajaxStart(function() {
    // alert('ajax started')
    obj = jQuery(document.body).data('ajax_emmiter')
    if(typeof obj != 'undefined') {
      obj.after('<div class="loader" style="width:'+obj.outerWidth().toString()+'px; height: '+obj.outerHeight().toString()+'px;"></div>');
      obj.addClass('ajax_hidden_emmiter');
      obj.hide();
    }
    jQuery(document.body).data('ajax_emmiter', undefined)
  });

  $(document).ajaxStop(function() {
    // alert('ajax_ready')
    jQuery("div.loader:empty").remove();
    jQuery('.ajax_hidden_emmiter').show();
  });  


/* ----- from a_small_things ends ---- */

  var close_sidebar = $('<a/>', {href: '#',
                                 id: 'close_sidebar_icon',
                                 class: 'R close_sidebar icon',
                                 click: function(){
                                  if($(this).hasClass('close_sidebar'))
                                    {                                    
                                    hide_sidebar($(this))    
                                    }
                                  else
                                    {
                                    show_sidebar($(this))                                    
                                    }

                                  }
                                })
  $('#sidebar').prepend(close_sidebar)
  $('#sidebar').dblclick(function(){                               
      hide_sidebar($('#close_sidebar_icon'))    
                                  
    })

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
  user_preferences['top_menu_event'] = 'mouseclick'
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

    }


  $('.splitcontentleft ul').each(function() {
    if($(this).children().length==0) {
      $(this).remove();
    }
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


  $('#q').attr('placeholder', $('label[for=q] a').text());
  $('label[for=q]').remove();
  $('#quick-search').insertAfter('#loggedas');

  $('div.tabs ul li a').each(function(index) {
    $(this).addClass('no_line in_link');
    $(this).html('<span>'+$(this).html()+'</span>');    
  });

  $('#q').focus(function(index) {
    $(this).data('last_width', $(this).width())
    $(this).animate({
                    width: 250,
                    }, 300, 'swing');
  });

  $('#q').blur(function(index) {
    $(this).animate({
                    width: $(this).data('last_width'),
                    }, 300, 'swing');
  });
});

/* ----- from a_small_things starts ---- */

function hide_sidebar(t)
  {
    $('#sidebar').hide()
    t.addClass('show_sidebar')
    t.removeClass('close_sidebar')
    $('#content').data('margin-right', $('#content').css('margin-right'))
    $('#content').css('margin-right', '16px')
    $('#sidebar').before(t)
  }
function show_sidebar(t)
  {
    $('#sidebar').show()
    t.removeClass('show_sidebar')
    t.addClass('close_sidebar')
    $('#content').css('margin-right',  $('#content').data('margin-right'))
    $('#sidebar').prepend(t)    
  }

// walk-around for non-working rails confirm in some cases (like for a.show_loader[data-remote="true"] - return false does not stop event)
function hard_confirm(label,event) {
  if(!confirm(label)){
    event.stopPropagation();
    return false;
  }
  return true;
}


function checkDueDateCalcIsHandy()
  {
    var start_date=$('input.issue_start_date');
    var due_date=$('input.issue_due_date');
    var estimated_hours=$('input.issue_estimated_hours');
    if(start_date && estimated_hours && due_date ) {
      if(due_date.val()=='' || due_date.data('set_auto_val') ) {
        if(/^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/.test(start_date.val()) && /^[0-9\.]{1,}$/.test(estimated_hours.val()))
          calcDueDate(start_date, due_date, estimated_hours);
      }
      else {
        if(/^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/.test(start_date.val())
          && /^[0-9\.]{1,}$/.test(estimated_hours.val())
          && /^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/.test(due_date.val())) {
          var date_arr=start_date.val().split(".");
          var issue_start_date = new Date(Date.parse(date_arr[2]+"-"+date_arr[1]+"-"+date_arr[0]));   
          date_arr=due_date.val().split("."); 
          var issue_due_date = new Date(Date.parse(date_arr[2]+"-"+date_arr[1]+"-"+date_arr[0])); 
          var days=(estimated_hours.val()/8).ceil();
          if(issue_due_date.getDate()-issue_start_date.getDate()<days-1)
            calcDueDate(start_date, due_date, estimated_hours);
        }
      }
    }
  }

function calcDueDate(start_date, due_date, estimated_hours) {
  var date_arr=start_date.val().split(".");
  var issue_due_date = new Date();
  var issue_start_date = new Date(Date.parse(date_arr[2]+"-"+date_arr[1]+"-"+date_arr[0]));
  var days=(estimated_hours.val()/8).ceil();
  var issue_due_date = new Date(issue_start_date.getTime()+(days-1)*1000*24*60*60+1);
  //issue_due_date.setDate(issue_start_date.getDate()+days-1);
      
  var month= issue_due_date.getMonth()+1;
  month=(month<10)? '0'+month : month;
  var day=issue_due_date.getDate();
  day=(day<10)? '0'+day: day;
  var year = issue_due_date.getFullYear();
  due_date.val(day+"."+month+"."+year);
  due_date.data('set_auto_val', true);
  due_date.addClass('highlight');       
}

setInterval(function() { 
    checkDueDateCalcIsHandy();
  }, 1000)
/* ----- from a_small_things ends ---- */